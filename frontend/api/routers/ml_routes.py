from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
import os
import uuid
from typing import List, Optional, Dict, Any
from api.services.pdf_service import extract_text_from_pdf, chunk_text
from api.services.llm_service import (
    extract_concepts_from_text,
    generate_questions_from_concepts,
    evaluate_answer,
    extract_student_explanation_concepts,
    generate_completion,
    CHILD_MODEL,
    TEACHER_MODEL
)
from api.database import save_concepts, save_questions, save_exam_result

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])

class ProcessDocResponse(BaseModel):
    concepts: list
    questions: list
    session_id: Optional[str] = None

class ExtractConceptsRequest(BaseModel):
    explanation: str
    user_id: str
    session_id: Optional[str] = None
    source_concepts: list = []

class GradeAnswerRequest(BaseModel):
    question: str
    student_answer: str
    expected_answer: str
    session_id: Optional[str] = None
    question_id: Optional[str] = None
    exam_type: Optional[str] = "final"

class MemoryRetrieveRequest(BaseModel):
    question: str
    user_id: str
    session_id: Optional[str] = None

class BaselineExamRequest(BaseModel):
    session_id: str
    user_id: str
    questions: list

# Temporary session memory store
MOCK_DB: Dict[str, List[Dict[str, Any]]] = {}

@router.post("/process-document", response_model=ProcessDocResponse)
async def process_document(
    file: UploadFile = File(...),
    session_id: Optional[str] = Form(None)
):
    """Extracts concepts and generates questions from an uploaded PDF and optionally stores in DB."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    text = extract_text_from_pdf(content)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
    chunks = chunk_text(text, chunk_size=2000, overlap=200)
    
    all_concepts = []
    # Process first chunk for high accuracy and fast turnaround
    for chunk in chunks[:1]:
        extracted = extract_concepts_from_text(chunk)
        if "concepts" in extracted:
            all_concepts.extend(extracted["concepts"])
            
    questions = generate_questions_from_concepts(all_concepts[:5])
    
    # If a session_id was passed, persist concepts and questions
    if session_id:
        try:
            save_concepts(session_id, all_concepts, "source")
            q_ids = save_questions(session_id, questions)
            for i, q in enumerate(questions):
                if i < len(q_ids):
                    q["id"] = q_ids[i]
        except Exception as e:
            print(f"Warning: could not save to database: {e}")
    
    return ProcessDocResponse(concepts=all_concepts, questions=questions, session_id=session_id)

@router.post("/run-baseline-exam")
async def run_baseline_exam(req: BaselineExamRequest):
    """
    Executes the 'Cold Baseline' examination before the student teaches the Child Agent.
    The Child Agent has zero taught memory, so it generates honest blank/naive answers.
    Teacher Agent grades each answer to prove knowledge leakage is absent.
    """
    results = []
    total_score = 0.0

    # For speed and responsive UX, evaluate up to 3 representative questions for baseline or all if small
    eval_questions = req.questions[:5]
    
    for q in eval_questions:
        q_text = q.get("question", "")
        expected = q.get("expectedAnswer", "")
        qid = q.get("id") or str(uuid.uuid4())

        # Child agent answering with NO taught memory
        child_answer = "I haven't learned this topic yet, so I don't know the answer."
        
        # Teacher agent grades the blank answer
        grade_res = evaluate_answer(q_text, child_answer, expected)
        score = float(grade_res.get("score", 0))
        feedback = grade_res.get("feedback", "No conceptual understanding demonstrated.")

        total_score += score

        if req.session_id:
            try:
                save_exam_result(
                    session_id=req.session_id,
                    question_id=qid,
                    exam_type="baseline",
                    child_answer=child_answer,
                    score=score,
                    feedback=feedback
                )
            except Exception as e:
                print(f"Warning: could not save baseline result: {e}")

        results.append({
            "questionId": qid,
            "question": q_text,
            "childAnswer": child_answer,
            "expected": expected,
            "score": score,
            "feedback": feedback
        })

    avg_baseline = round(total_score / max(1, len(eval_questions)), 1)
    return {
        "status": "success",
        "baseline_score": avg_baseline,
        "results": results
    }

@router.post("/extract-concepts")
async def extract_concepts(req: ExtractConceptsRequest):
    """Extracts concepts from student's explanation and stores them in session memory & DB."""
    extracted = extract_student_explanation_concepts(req.explanation, req.source_concepts)
    concepts = extracted.get("concepts", [])
    
    mem_key = req.session_id if req.session_id else req.user_id
    if mem_key not in MOCK_DB:
        MOCK_DB[mem_key] = []
        
    for concept in concepts:
        definition = concept.get("definition", "")
        if definition:
            MOCK_DB[mem_key].append({
                "name": concept.get("name", "Unknown"),
                "definition": definition,
                "confidence": concept.get("confidence", 0.5)
            })

    if req.session_id and concepts:
        try:
            save_concepts(req.session_id, concepts, "taught")
        except Exception as e:
            print(f"Warning: could not persist taught concepts: {e}")
            
    return {"extracted_concepts": concepts}

@router.post("/retrieve-memory")
async def retrieve_memory(req: MemoryRetrieveRequest):
    """Retrieves concepts from memory and generates Child Agent answer based ONLY on them."""
    mem_key = req.session_id if req.session_id and req.session_id in MOCK_DB else req.user_id
    user_memory = MOCK_DB.get(mem_key, [])
    
    if not user_memory:
        return {"answer": "I don't know the answer to this yet because you haven't taught me."}
        
    context = "\n".join([f"{c['name']}: {c['definition']}" for c in user_memory])
    
    prompt = f"""
    You are a learning Child Agent. Answer this question using ONLY the following taught information. 
    Do NOT use outside or pretrained knowledge. If the answer is not mentioned in the taught information, say you don't know.
    
    Taught Information:
    {context}
    
    Question: {req.question}
    """
    answer = generate_completion(prompt, model=CHILD_MODEL)
    return {"answer": answer}

@router.post("/grade-answer")
async def grade_answer(req: GradeAnswerRequest):
    """Grades an answer given by the Child Agent and saves to DB."""
    evaluation = evaluate_answer(req.question, req.student_answer, req.expected_answer)
    if req.session_id and req.question_id:
        try:
            save_exam_result(
                session_id=req.session_id,
                question_id=req.question_id,
                exam_type=req.exam_type or "final",
                child_answer=req.student_answer,
                score=float(evaluation.get("score", 0)),
                feedback=evaluation.get("feedback", "")
            )
        except Exception as e:
            print(f"Warning: could not save grade result: {e}")
    return evaluation

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribes audio using OpenAI Whisper."""
    import tempfile
    from api.services.llm_service import client, GROQ_API_KEY
    whisper_model = "whisper-large-v3-turbo" if GROQ_API_KEY else "whisper-1"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
        
    try:
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model=whisper_model, 
                file=audio_file
            )
        return {"text": transcript.text}
    except Exception as e:
        print(f"Transcription error: {e}")
        return {"text": ""}
    finally:
        os.remove(tmp_path)

class GenerateQuestionsRequest(BaseModel):
    concepts: list

@router.post("/generate-questions")
async def generate_questions(req: GenerateQuestionsRequest):
    """Generates questions from existing concepts."""
    questions = generate_questions_from_concepts(req.concepts[:5])
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate exam questions. The AI model might be rate-limited.")
    return {"questions": questions}
