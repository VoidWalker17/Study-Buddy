with open("frontend/src/pages/StudyTool.tsx", "r") as f:
    code = f.read()

old_res = """const res = await axios.post('/api/ml/generate-questions', { concepts: result?.concepts || [] });"""
new_res = """const res = await axios.post('/api/ml/generate-questions', { 
          concepts: result?.concepts?.length ? result.concepts : taughtConcepts.map(c => ({ term: c.concept, definition: "" })) 
        });"""

code = code.replace(old_res, new_res)

with open("frontend/src/pages/StudyTool.tsx", "w") as f:
    f.write(code)

print("Fixed StudyTool concepts")
