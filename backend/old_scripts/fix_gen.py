import re

with open("backend-python/routers/ml_routes.py", "r") as f:
    code = f.read()

code = code.replace(
    "questions = generate_questions_from_concepts(all_concepts)",
    "questions = generate_questions_from_concepts(all_concepts[:5])  # Limit to 5 concepts to prevent token overflow"
)

with open("backend-python/routers/ml_routes.py", "w") as f:
    f.write(code)

print("Done")
