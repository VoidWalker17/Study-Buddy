import re

with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

# Replace Node.js upload URL with python direct URL
code = code.replace(
    "'http://localhost:3000/api/resources/upload'",
    "'/api/ml/process-document'"
)

# Replace other python endpoints
code = code.replace(
    "'http://localhost:8000/ml/extract-concepts'",
    "'/api/ml/extract-concepts'"
)
code = code.replace(
    "'http://localhost:8000/ml/retrieve-memory'",
    "'/api/ml/retrieve-memory'"
)
code = code.replace(
    "'http://localhost:8000/ml/grade-answer'",
    "'/api/ml/grade-answer'"
)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Fixed frontend URLs")
