import json
from services.llm_service import generate_questions_from_concepts
concepts = [{"name": "OS", "definition": "Operating System"}]
print(json.dumps(generate_questions_from_concepts(concepts), indent=2))
