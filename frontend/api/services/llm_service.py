import os
import json
from openai import OpenAI

# ---------------------------------------------------------
# Load .env file automatically if present
# ---------------------------------------------------------
def _load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

_load_env()

# Configure Provider: Groq Cloud (Default when GROQ_API_KEY set) with Ollama fallback
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

if GROQ_API_KEY and GROQ_API_KEY.startswith("gsk_"):
    LLM_BASE_URL = "https://api.groq.com/openai/v1"
    LLM_API_KEY = GROQ_API_KEY
    TEACHER_MODEL = os.environ.get("TEACHER_MODEL", "openai/gpt-oss-120b")
    CHILD_MODEL = os.environ.get("CHILD_MODEL", "openai/gpt-oss-20b")
    DEFAULT_MODEL = TEACHER_MODEL
    print("Using Groq Cloud Inference (Teacher: 120B Flagship | Child: 20B Lightweight)")
else:
    LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "http://localhost:11434/v1")
    LLM_API_KEY = os.environ.get("LLM_API_KEY", "ollama")
    TEACHER_MODEL = "llama3.1"
    CHILD_MODEL = "llama3.1"
    DEFAULT_MODEL = "llama3.1"
    print("Using Local Ollama Inference (Llama 3.1)")

client = OpenAI(
    api_key=LLM_API_KEY,
    base_url=LLM_BASE_URL
)

def clean_json(text: str) -> str:
    """Removes markdown code blocks to ensure valid JSON."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def generate_completion(prompt: str, model: str = DEFAULT_MODEL, response_format_json: bool = False, temperature: float = 0.2) -> str:
    """Generates a completion from Groq Cloud or local Ollama."""
    try:
        kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature
        }
        
        if response_format_json:
            kwargs["response_format"] = { "type": "json_object" }

        response = client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling LLM: {e}")
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
    
    EXTREMELY IMPORTANT CONSTRAINTS:
    1. DO NOT reuse the same scenario or variables across questions.
    2. Every single question MUST test a completely different physics/theoretical concept from the provided list.
    3. Ensure maximum variety in question structure (e.g., use "What if", "Compare and contrast", "Explain why", "Analyze the outcome", etc.).
    4. Do not simply swap out a word (like "prism" for "grating") to create a new question. Each question must be distinct and uniquely thought-provoking.
    
    OUTPUT ONLY A VALID JSON OBJECT. NO EXPLANATIONS. NO MARKDOWN OR CONVERSATIONAL TEXT.
    Structure:
    {{"questions": [{{"question": "Complex Q text...", "expectedAnswer": "Detailed 2-3 sentence A text...", "difficulty": "medium/hard", "concepts": ["Concept1"]}}]}}
    Concepts: {concepts_str}
    """
    
    # Use higher temperature (0.7) for diverse questions
    result = generate_completion(prompt, response_format_json=True, temperature=0.7)
    try:
        parsed = json.loads(clean_json(result))
        return parsed.get("questions", [])
    except Exception as e:
        print(f"Error generating questions: {e}")
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
