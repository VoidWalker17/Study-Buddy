# BEGINNER_CODE_WALKTHROUGH

This document traces exactly how a feature works from the user clicking a button in the browser to the backend returning data.

## Flow 1: Uploading the PDF and Generating Questions

**1. The User Interface (`frontend/src/pages/StudyTool.tsx`)**
*   The user selects a PDF file and clicks upload.
*   A `FormData` object is created and the file is appended to it.
*   An HTTP POST request is sent to `http://localhost:8000/api/ml/process-document`.

**2. The API Route (`api/routers/ml_routes.py`)**
*   FastAPI receives the request at the `@router.post("/process-document")` endpoint.
*   It passes the raw file bytes to `pdf_service.py`.

**3. Text Extraction (`api/services/pdf_service.py`)**
*   `pdf_service.extract_text(file)` uses the `PyPDF2` library.
*   It reads the binary data, loops through the pages, and extracts raw text strings.

**4. The AI Processing (`api/services/llm_service.py`)**
*   The extracted text goes to `llm_service.py`.
*   Two things happen:
    1.  The LLM is asked to extract key concepts (Ground Truth).
    2.  The LLM is asked to generate 10 exam questions based on the text.
*   We force the LLM to output valid JSON by specifying a strict JSON structure in the prompt.

**5. Back to UI (`frontend/src/pages/StudyTool.tsx`)**
*   The backend returns the JSON containing the concepts and questions.
*   React updates its state (`setQuestions(data.questions)`), moving the UI to Step 2 (Teach Agent).

---

## Flow 2: The Child Agent Exam

**1. The User Interface (`frontend/src/pages/StudyTool.tsx`)**
*   In the evaluation phase, the UI loops through the 10 generated questions.
*   For each question, it sends a request to `http://localhost:8000/api/ml/retrieve-memory`.

**2. The Memory Retrieval (`api/routers/ml_routes.py`)**
*   The endpoint checks `MOCK_DB["test-user-123"]["knowledge"]`. This contains the exact explanations the student provided during the teaching phase.

**3. The Child Agent Prompt (`api/services/llm_service.py`)**
*   We send the LLM the Question AND the `MOCK_DB` knowledge.
*   **Crucial Rule:** The prompt says "You are a child. Answer the question using ONLY the provided knowledge context. Do not use outside knowledge."
*   The LLM generates an answer based strictly on the student's teaching.

**4. The Teacher Agent Grading (`api/routers/ml_routes.py` -> `llm_service.py`)**
*   We send the Child's answer, the Question, and the Expected Answer to another endpoint: `/grade-answer`.
*   A different prompt (Teacher Prompt) evaluates the Child's answer.
*   It outputs a score (0-100) and feedback in JSON.

**5. Efficacy Score**
*   The frontend calculates the average of all 10 grades to provide the final "Teaching Efficacy Score".
