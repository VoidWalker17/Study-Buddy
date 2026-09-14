with open("frontend/api/routers/ml_routes.py", "r") as f:
    code = f.read()

replacement = """    if not all_concepts:
        raise HTTPException(status_code=500, detail="Failed to extract concepts. The AI model might be rate-limited. Please try again.")
        
    questions = generate_questions_from_concepts(all_concepts[:5])
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate exam questions. The AI model might be rate-limited. Please try again.")
        
    return ProcessDocResponse(concepts=all_concepts, questions=questions)"""

code = code.replace("""    questions = generate_questions_from_concepts(all_concepts[:5])
    return ProcessDocResponse(concepts=all_concepts, questions=questions)""", replacement)

with open("frontend/api/routers/ml_routes.py", "w") as f:
    f.write(code)

print("Fixed")
