import os
import json
from openai import OpenAI

# ---------------------------------------------------------
# FILL IN YOUR CLOUD LLM DETAILS HERE
# Example for NVIDIA NIM: 
#   BASE_URL = "https://integrate.api.nvidia.com/v1"
#   API_KEY = "nvapi-..." 
#   MODEL_NAME = "meta/llama3-70b-instruct"
# Example for Gemini API (OpenAI compatible endpoint):
#   BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
#   API_KEY = "your-gemini-api-key"
#   MODEL_NAME = "gemini-1.5-pro"
# ---------------------------------------------------------
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "http://localhost:11434/v1")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "ollama") # Ollama doesn't need an API key, but openai client requires something
DEFAULT_MODEL = os.environ.get("LLM_MODEL", "llama3.1")

client = OpenAI(
    api_key=LLM_API_KEY,
    base_url=LLM_BASE_URL
)

def clean_json(text: str) -> str:
    """Removes markdown code blocks to ensure valid JSON."""
    print("RAW LLM OUTPUT:", text)
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    cleaned = text.strip()
    print("CLEANED JSON OUTPUT:", cleaned)
    return cleaned

def generate_completion(prompt: str, model: str = DEFAULT_MODEL, response_format_json: bool = False) -> str:
    """Generates a completion from the configured cloud LLM."""
    try:
        kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        
        if response_format_json:
            kwargs["response_format"] = { "type": "json_object" }

        response = client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Cloud LLM: {e}")
        return ""

def extract_concepts_from_text(text: str) -> dict:
    prompt = f"""
    Extract key concepts from this text.
    OUTPUT ONLY A VALID JSON OBJECT. NO EXPLANATIONS. NO MARKDOWN OR CONVERSATIONAL TEXT.
    Structure:
    {{"concepts": [{{"name": "Concept1", "definition": "Def1", "dependencies": ["Dep1"]}}]}}
    Text: "{text}"
    """
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {"concepts": []}

def generate_questions_from_concepts(concepts: list) -> list:
    concepts_str = json.dumps(concepts)
    prompt = f"""
    Generate 10 high-quality practice questions based on the following concepts. 
    Crucially, these must NOT be simple one-word answer questions. They must be conceptual, analytical, or application-based questions that require at least 2-3 sentences to answer properly.
    The difficulty should be heavily skewed towards 'medium' and 'hard'. Do not include basic definition questions.
    
    OUTPUT ONLY A VALID JSON OBJECT. NO EXPLANATIONS. NO MARKDOWN OR CONVERSATIONAL TEXT.
    Structure:
    {{"questions": [{{"question": "Complex Q text...", "expectedAnswer": "Detailed 2-3 sentence A text...", "difficulty": "medium/hard", "concepts": ["Concept1"]}}]}}
    Concepts: {concepts_str}
    """
    result = generate_completion(prompt, response_format_json=True)
    try:
        parsed = json.loads(clean_json(result))
        return parsed.get("questions", [])
    except json.JSONDecodeError:
        return []

def evaluate_answer(question: str, student_answer: str, expected_answer: str) -> dict:
    prompt = f"""
    Grade this answer on a 0-100 scale based on semantic correctness.
    Question: {question}
    Student's Answer: {student_answer}
    Expected Answer (from source material): {expected_answer}
    
    OUTPUT ONLY A VALID JSON OBJECT. NO EXPLANATIONS. NO MARKDOWN OR CONVERSATIONAL TEXT.
    Structure:
    {{"score": 85, "feedback": "Detailed feedback..."}}
    """
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {"score": 0, "feedback": "Failed to parse evaluation."}

def extract_student_explanation_concepts(explanation: str, source_concepts: list = None) -> dict:
    source_context = json.dumps(source_concepts) if source_concepts else "None"
    prompt = f"""
    Extract key concepts from the student's explanation. 
    Crucially, evaluate how well the student actually understands each concept compared to the original source concepts provided below. 
    If their explanation is simplistic, confused, or admits partial knowledge (like 40% understanding), assign a VERY LOW confidence score (e.g., 0.1 - 0.4).
    Only assign high confidence (>0.8) if their explanation perfectly matches the depth and nuance of the source material.
    
    Source Concepts for reference:
    {source_context}
    
    Student's Explanation: "{explanation}"
    
    OUTPUT ONLY A VALID JSON OBJECT. NO EXPLANATIONS. NO MARKDOWN OR CONVERSATIONAL TEXT.
    Structure:
    {{"concepts": [{{"name": "Concept Name", "definition": "Definition provided by student...", "confidence": 0.5, "dependencies": ["Dep1"]}}]}}
    """
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {"concepts": []}
