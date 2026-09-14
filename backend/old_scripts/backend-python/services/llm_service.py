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
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
DEFAULT_MODEL = os.environ.get("LLM_MODEL", "gemini-2.5-flash")

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

def generate_completion(prompt: str, model: str = DEFAULT_MODEL, response_format_json: bool = False) -> str:
    """Generates a completion from the configured cloud LLM."""
    try:
        kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }
        
        # Some providers don't support response_format strict json yet, 
        # so we rely on prompt engineering mostly. If using OpenAI, you can uncomment this:
        # if response_format_json:
        #     kwargs["response_format"] = { "type": "json_object" }

        response = client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Cloud LLM: {e}")
        return ""

def extract_concepts_from_text(text: str) -> dict:
    prompt = f"""
    Extract key concepts from this text. Return a valid JSON object with a single key "concepts" containing an array of objects.
    Each object should have "name", "definition", and "dependencies" (an array of strings).
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
    Generate 5 practice questions based on the following concepts. 
    Return a valid JSON object with a key "questions" containing an array of objects.
    Each object should have "question", "expectedAnswer", "difficulty" (easy/medium/hard), and "concepts" (array of concept names).
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
    Respond strictly with valid JSON: {{"score": <number>, "feedback": "<string explanation>"}}
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
    
    Return strictly valid JSON:
    {{"concepts": [{{"name": "Concept Name", "definition": "Definition provided by student...", "confidence": <float between 0.0 and 1.0 representing accuracy/depth of understanding>, "dependencies": ["Dep1"]}}]}}
    """
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {"concepts": []}
