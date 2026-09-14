import re

with open("backend-python/routers/ml_routes.py", "r") as f:
    code = f.read()

code = code.replace(
    "class ExtractConceptsRequest(BaseModel):\n    explanation: str\n    user_id: str",
    "class ExtractConceptsRequest(BaseModel):\n    explanation: str\n    user_id: str\n    source_concepts: list = []"
)

code = code.replace(
    "extracted = extract_student_explanation_concepts(req.explanation)",
    "extracted = extract_student_explanation_concepts(req.explanation, req.source_concepts)"
)

with open("backend-python/routers/ml_routes.py", "w") as f:
    f.write(code)

with open("backend-python/services/llm_service.py", "r") as f:
    code = f.read()

old_func = """def extract_student_explanation_concepts(explanation: str) -> dict:
    prompt = f\"\"\"
    Extract key concepts from this explanation. Return strictly valid JSON:
    {{\"concepts\": [{{\"name\": \"Concept Name\", \"definition\": \"Definition provided...\", \"confidence\": 0.95, \"dependencies\": [\"Dep1\"]}}]}}
    Explanation: \"{explanation}\"
    \"\"\"
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {\"concepts\": []}"""

new_func = """def extract_student_explanation_concepts(explanation: str, source_concepts: list = None) -> dict:
    source_context = json.dumps(source_concepts) if source_concepts else "None"
    prompt = f\"\"\"
    Extract key concepts from the student's explanation. 
    Crucially, evaluate how well the student actually understands each concept compared to the original source concepts provided below. 
    If their explanation is simplistic, confused, or admits partial knowledge (like 40% understanding), assign a VERY LOW confidence score (e.g., 0.1 - 0.4).
    Only assign high confidence (>0.8) if their explanation perfectly matches the depth and nuance of the source material.
    
    Source Concepts for reference:
    {source_context}
    
    Student's Explanation: "{explanation}"
    
    Return strictly valid JSON:
    {{\"concepts\": [{{\"name\": \"Concept Name\", \"definition\": \"Definition provided by student...\", \"confidence\": <float between 0.0 and 1.0 representing accuracy/depth of understanding>, \"dependencies\": [\"Dep1\"]}}]}}
    \"\"\"
    result = generate_completion(prompt, response_format_json=True)
    try:
        return json.loads(clean_json(result))
    except json.JSONDecodeError:
        return {\"concepts\": []}"""

code = code.replace(old_func, new_func)

with open("backend-python/services/llm_service.py", "w") as f:
    f.write(code)

print("Done")
