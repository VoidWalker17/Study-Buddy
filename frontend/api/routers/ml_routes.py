from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import os
import uuid
from typing import List, Optional
from api.services.pdf_service import extract_text_from_pdf, chunk_text
from api.services.llm_service import extract_concepts_from_text, generate_questions_from_concepts, evaluate_answer, extract_student_explanation_concepts, generate_completion

# Optional: Try importing chromadb and sentence-transformers
try:
    import chromadb
    from sentence_transformers import SentenceTransformer
    chroma_client = chromadb.PersistentClient(path=os.path.join(os.getcwd(), "chroma_db"))
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_CHROMA = True
except ImportError:
    HAS_CHROMA = False
    print("Warning: ChromaDB or SentenceTransformers not installed. Memory storage will be mocked.")

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])

class ProcessDocResponse(BaseModel):
    concepts: list
    questions: list

class ExtractConceptsRequest(BaseModel):
    explanation: str
    user_id: str
    source_concepts: list = []

class GradeAnswerRequest(BaseModel):
    question: str
    student_answer: str
    expected_answer: str

class MemoryRetrieveRequest(BaseModel):
    question: str
    user_id: str

@router.post("/process-document", response_model=ProcessDocResponse)
async def process_document(file: UploadFile = File(...)):
    """Extracts concepts and generates questions from an uploaded PDF."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    content = await file.read()
    text = extract_text_from_pdf(content)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
    chunks = chunk_text(text, chunk_size=2000, overlap=200)
    
    all_concepts = []
    # For MVP, we'll just process the first chunk to save time and API costs
    for chunk in chunks[:1]:
        extracted = extract_concepts_from_text(chunk)
        if "concepts" in extracted:
            all_concepts.extend(extracted["concepts"])
            
    questions = generate_questions_from_concepts(all_concepts[:5])  # Limit to 5 concepts to prevent token overflow
    
    return ProcessDocResponse(concepts=all_concepts, questions=questions)

# Temporary in-memory store for MVP since ChromaDB might fail to install on py3.13
MOCK_DB = {}

@router.post("/extract-concepts")
async def extract_concepts(req: ExtractConceptsRequest):
    """Extracts concepts from student's explanation and stores them in memory."""
    extracted = extract_student_explanation_concepts(req.explanation, req.source_concepts)
    concepts = extracted.get("concepts", [])
    
    if req.user_id not in MOCK_DB:
        MOCK_DB[req.user_id] = []
        
    for concept in concepts:
        definition = concept.get("definition", "")
        if definition:
            MOCK_DB[req.user_id].append({
                "name": concept.get("name", "Unknown"),
                "definition": definition
            })
            
    return {"extracted_concepts": concepts}

@router.post("/retrieve-memory")
async def retrieve_memory(req: MemoryRetrieveRequest):
    """Retrieves concepts from memory and generates Child Agent answer based ONLY on them."""
    user_memory = MOCK_DB.get(req.user_id, [])
    
    if not user_memory:
        return {"answer": "I don't know the answer to this yet because you haven't taught me."}
        
    # Simple concatenation of all taught concepts for context (since dataset is small)
    context = "\n".join([f"{c['name']}: {c['definition']}" for c in user_memory])
    
    prompt = f"""
    Answer this question using ONLY the following information. Do not use outside knowledge.
    
    Information:
    {context}
    
    Question: {req.question}
    """
    answer = generate_completion(prompt)
    return {"answer": answer}

@router.post("/grade-answer")
async def grade_answer(req: GradeAnswerRequest):
    """Grades an answer given by the Child Agent."""
    return evaluate_answer(req.question, req.student_answer, req.expected_answer)

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribes audio using OpenAI Whisper."""
    import tempfile
    from api.services.llm_service import client
    
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name
        
    try:
        with open(tmp_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", 
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
    """Generates questions from existing concepts, useful for retrying if rate-limited during upload."""
    questions = generate_questions_from_concepts(req.concepts[:5])
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate exam questions. The AI model might be rate-limited.")
    return {"questions": questions}
