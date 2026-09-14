import os
docs_dir = "/Users/agarwaldivyansh/Documents/MY CODE/2026/Study-Buddy/docs"

files = {}

files["VIVA_CRASH_SHEET.md"] = """# PART 24 — VIVA CRASH SHEET

## 1. Project in 30 seconds
"Study Buddy uses the Feynman technique. You upload a PDF, teach it to a blank-slate 'Child AI', and a 'Teacher AI' evaluates you by grading how well the Child AI answers exam questions based solely on your teaching."

## 2. Top 5 Things to Remember
1. **Teacher vs Child**: Teacher knows the PDF. Child ONLY knows what you teach it.
2. **Tech Stack**: React, FastAPI, local Ollama Llama 3.1.
3. **Where is isolation?**: `ml_routes.py` inside `retrieve_memory` (Context restriction).
4. **Where is memory?**: `MOCK_DB` python dictionary (in-memory, lost on restart).
5. **Where is scoring?**: Frontend `StudyTool.tsx` averages the grades given by the Teacher.

## 3. DO NOT CLAIM (Not Implemented)
- Do NOT claim we have a persistent database (MySQL/Mongo/Chroma).
- Do NOT claim we have user login.
- Do NOT claim we process 100-page PDFs (we only chunk the first 2000 chars for MVP speed).
- Do NOT claim we use OpenAI Whisper for audio (we use browser Web Speech API).
"""

files["DEMO_SCRIPT.md"] = """# PART 25 — ACTUAL DEMO SCRIPT

## How to Demo the Project

1. **Start Application**: Ensure Ollama is running (`ollama run llama3.1`). Start frontend (`npm run dev`) and backend (`uvicorn index:app`).
2. **Show UI**: Open browser. Click "Get Started".
3. **Upload Material**: Drag and drop a small PDF (e.g., your acoustics PPT). 
   *Say: "The system is now extracting text and having the Teacher LLM secretly generate 10 exam questions."*
4. **Teaching**: Use the Voice Input or type a brief explanation. (Make sure you use Google Chrome for voice to work).
   *Say: "I am now teaching the blank-slate Child Agent. The backend is converting my messy speech into structured concepts."*
5. **Click Submit Knowledge**: Wait for the success state.
6. **Start Final Exam**: Click the button.
   *Say: "Now the React frontend is looping through the 10 questions. For each one, the Child answers from memory, and the Teacher immediately grades it."*
7. **Show Results**: Scroll through the glassmorphic cards showing the Child's answers and Teacher's feedback. Show the final Score at the top.
"""

files["KNOW_YOUR_PROJECT.md"] = """# PART 26 — FINAL "KNOW YOUR PROJECT" MAP

```text
PROJECT
│
├── USER INTERFACE
│   └── frontend/src/pages/StudyTool.tsx (React)
│
├── BACKEND
│   ├── frontend/api/index.py (FastAPI Setup)
│   └── frontend/api/routers/ml_routes.py (API Routes)
│
├── TEACHER AGENT
│   └── frontend/api/services/llm_service.py (Prompts: generate_questions, evaluate_answer)
│
├── CHILD AGENT
│   └── frontend/api/routers/ml_routes.py (Route: retrieve_memory)
│
├── MEMORY
│   └── frontend/api/services/llm_service.py (Prompt: extract_student_explanation_concepts)
│
├── STORAGE
│   └── frontend/api/routers/ml_routes.py (Variable: MOCK_DB = {})
```

**If you remember only 3 things:**
1. The **Backend** is Python FastAPI.
2. The **Intelligence** is `llm_service.py` making calls to Ollama (Llama 3.1).
3. The **State/Orchestration** is `StudyTool.tsx` (React).
"""

for filename, content in files.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content)
