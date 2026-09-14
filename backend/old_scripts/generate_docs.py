import os

docs_dir = "docs"
os.makedirs(docs_dir, exist_ok=True)

docs = {
    "01_PROJECT_OVERVIEW.md": """# Study Buddy - Project Overview

## What is Study Buddy?
Study Buddy is an AI-powered educational tool designed to test a student's true understanding of a subject using the Feynman Technique. 

## The Core Concept
Instead of the AI teaching the student, the **Student teaches the AI**. 
1. **Teacher Agent:** Parses a ground-truth document (like a PDF/PPT) and extracts core concepts and generates exam questions.
2. **Child Agent:** Acts as a "blank slate" student. It has no access to the PDF.
3. **Knowledge Transfer:** The human student must explain the concepts to the Child Agent using their own words.
4. **Neural Evaluation:** The Child Agent attempts to answer the Teacher Agent's exam questions using *only* the knowledge it learned from the human student.
5. **Grading:** The Teacher Agent grades the Child Agent's answers. If the Child Agent fails, it means the human student's explanation was poor.

## Purpose of the Prototype
The prototype demonstrates a dual-agent architecture (Teacher vs Student AI) running on local LLMs (Llama 3.1 via Ollama) to evaluate teaching efficacy.
""",

    "02_SYSTEM_WORKING.md": """# System Working - End-to-End Flow

1. **Upload Source (UI):** The user uploads a PDF document.
2. **Document Processing (API):** The backend `/process-document` endpoint extracts text using PyPDF2 and chunks it.
3. **Teacher Agent Extraction:** The `extract_concepts_from_text` function uses the LLM to pull key concepts from the PDF.
4. **Question Generation:** The `generate_questions_from_concepts` function generates 10 complex questions based on the concepts.
5. **Knowledge Transfer (UI):** The user speaks or types an explanation of the concepts.
6. **Concept Extraction (API):** The `/extract-concepts` endpoint evaluates the user's explanation against the source concepts and builds the Child Agent's memory.
7. **Exam Execution (UI/API):** The frontend loops through the generated questions. For each question, it calls `/retrieve-memory` (Child Agent).
8. **Child Agent Answering:** The Child Agent answers the question using only the isolated memory provided by the user.
9. **Grading (API):** The `/grade-answer` endpoint (Teacher Agent) compares the Child Agent's answer against the expected answer and assigns a score.
10. **Results (UI):** The frontend calculates the average score and displays the feedback.
""",

    "03_CODEBASE_GUIDE.md": """# Codebase Guide

## Project Structure
```
frontend/
├── api/
│   ├── index.py              # FastAPI application entry point
│   ├── routers/
│   │   └── ml_routes.py      # API endpoints for ML/AI operations
│   ├── services/
│   │   ├── llm_service.py    # LLM integration (OpenAI/Ollama)
│   │   └── pdf_service.py    # PDF parsing logic
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx   # Marketing landing page
│   │   └── StudyTool.tsx     # Main application interface
│   ├── App.tsx               # React router setup
│   └── main.tsx              # React entry point
├── package.json              # Frontend dependencies
└── vite.config.ts            # Vite bundler configuration (includes API proxy)
```

## Key Files
- `llm_service.py`: Contains the core agent prompts and LLM API calls.
- `ml_routes.py`: Connects frontend requests to the LLM service.
- `StudyTool.tsx`: Manages the complex UI state machine (Upload -> Teach -> Evaluate).
""",

    "07_AI_AND_PROMPTS.md": """# AI and Prompts

## Model Configuration
The project is configured to use **Llama 3.1** running locally via **Ollama**. It uses the standard `openai` Python client pointed at `http://localhost:11434/v1`.

## Core Prompts (in `llm_service.py`)

### 1. Concept Extraction (Teacher Agent)
Extracts raw concepts from the PDF text. Forces strict JSON output.

### 2. Question Generation (Teacher Agent)
Generates 10 medium/hard questions based on the extracted concepts. Demands 2-3 sentence expected answers.

### 3. Student Evaluation (Memory Engine)
Evaluates the human's explanation against the source concepts. Assigns a confidence score based on how well the human explained it.

### 4. Memory Retrieval (Child Agent)
Answers the generated questions using ONLY the context provided in the user's memory. Strict instructions to avoid outside knowledge.

### 5. Grading (Teacher Agent)
Grades the Child Agent's answer on a 0-100 scale by comparing it to the expected answer.
""",

    "09_BACKEND_API_GUIDE.md": """# Backend API Guide

The backend is built with FastAPI and runs on port 8000.

## Endpoints (`/api/ml`)

### `POST /process-document`
- **Input:** PDF file upload.
- **Processing:** Extracts text -> Chunks text -> Extracts concepts -> Generates questions.
- **Output:** JSON containing `concepts` and `questions`.

### `POST /extract-concepts`
- **Input:** User's explanation text and the original source concepts.
- **Processing:** Evaluates the explanation and builds the Child Agent's memory.
- **Output:** JSON containing `extracted_concepts` (with confidence scores).

### `POST /retrieve-memory`
- **Input:** A question and the user's memory database.
- **Processing:** Child Agent answers the question using only the memory.
- **Output:** JSON containing `answer`.

### `POST /grade-answer`
- **Input:** Question, Child Agent's answer, Expected answer.
- **Processing:** Teacher Agent grades the answer 0-100.
- **Output:** JSON containing `score` and `feedback`.
""",

    "13_ARCHITECTURE.md": """# System Architecture

```text
                 HUMAN STUDENT
                       |
               [React Frontend] (StudyTool.tsx)
                 /           \
                /             \
        [Upload PDF]      [Explain Concepts]
              |                 |
              v                 v
       FastAPI Backend    FastAPI Backend
       (/process-doc)     (/extract-concepts)
              |                 |
              v                 v
       TEACHER AGENT       MEMORY ENGINE
       (Llama 3.1)         (Llama 3.1)
              |                 |
              v                 v
        [Questions]       [Child Memory]
              \                 /
               \               /
                v             v
             CHILD AGENT EXAM PHASE
             (/retrieve-memory)
                       |
                       v
                 TEACHER GRADING
                 (/grade-answer)
                       |
                       v
                FINAL EFFICACY SCORE
```
"""
}

for filename, content in docs.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content)

print("Technical documentation generated in docs/ directory.")
