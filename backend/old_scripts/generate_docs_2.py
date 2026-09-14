import os
docs_dir = "/Users/agarwaldivyansh/Documents/MY CODE/2026/Study-Buddy/docs"

files = {}

files["07_AI_AND_PROMPTS.md"] = """# PART 7 — AI / LLM WORKING

## Model Details
- **Model Used**: Local Llama 3.1 (8B parameters).
- **API Wrapper**: Ollama (running locally on port 11434).
- **Client**: We use the official Python `openai` library because Ollama provides an OpenAI-compatible endpoint.

## Integration Details
- **Location**: `frontend/api/services/llm_service.py`
- **Error Handling**: Wrapped in `try-except` blocks. If the LLM returns invalid JSON or crashes, the system catches `json.JSONDecodeError` and returns safe fallbacks (e.g., empty arrays or 0 scores).
- **Conversation History**: **NO.** Conversation history is not sent. Every request is completely stateless.

## Simplified Prompt Flow Example

**Extracting Concepts from PDF (Teacher Prep)**
```text
INPUT (from PyPDF2): "Interference is the phenomenon where two waves superpose..."
↓
PROMPT: "Extract key concepts from this text. OUTPUT ONLY A VALID JSON OBJECT..."
↓
MODEL: Llama 3.1 8B
↓
OUTPUT: {"concepts": [{"name": "Interference", "definition": "..."}]}
```

**Grading (Teacher Evaluator)**
```text
INPUT: 
Question: "What is interference?"
Student's Answer (Child Agent): "It's when waves crash."
Expected: "The superposition of two coherent waves..."
↓
PROMPT: "Grade this answer on a 0-100 scale based on semantic correctness. OUTPUT ONLY A VALID JSON OBJECT..."
↓
MODEL: Llama 3.1 8B
↓
OUTPUT: {"score": 20, "feedback": "The answer is far too vague..."}
```
"""

files["08_FRONTEND_GUIDE.md"] = """# PART 8 — FRONTEND / UI

## Overall Structure
The UI is a single-page React application (`StudyTool.tsx`) built with Tailwind CSS v4 and GSAP for animations. It is divided into 3 distinct "Steps".

### Step 1: Upload Source
- **Displays**: A drag-and-drop zone for PDF files.
- **Action**: User selects a PDF.
- **Behind the scenes**: Calls `POST /api/ml/process-document`. The backend parses the text and generates 10 questions.
- **UI Update**: `result` state is populated. Transitions to Step 2.

### Step 2: Knowledge Transfer
- **Displays**: A large text area for teaching, a "Voice Input" button, and the "View Questions / Download PDF" action bar.
- **Action**: User types or speaks (using browser Web Speech API), then clicks "Submit Knowledge".
- **Behind the scenes**: Calls `POST /api/ml/extract-concepts` with the text.
- **UI Update**: `taughtConcepts` state is updated, unlocking the "Start Final Exam" button.

### Step 3: Neural Evaluation (The Exam)
- **Displays**: First, a beautiful loading state ("Administering Final Exam..."). Then, a premium glassmorphic list of all questions, the Child's answers, the Teacher's feedback, and an Overall Score.
- **Action**: User clicks "Start Final Exam" (in Step 2).
- **Behind the scenes**: The frontend `runExam()` function loops 10 times. For each question, it calls `retrieve-memory` (Child answers) and then `grade-answer` (Teacher grades).
- **UI Update**: `examResults` state is populated iteratively, then rendered.

## Flow
`User Clicks Upload` → `FastAPI parses PDF & Generates Qs` → `User Teaches` → `FastAPI Extracts Concepts to MOCK_DB` → `User Starts Exam` → `React loops API calls` → `UI shows Final Score`.
"""

files["09_BACKEND_API_GUIDE.md"] = """# PART 9 — BACKEND / API

## API Endpoints (`ml_routes.py`)

### 1. `POST /api/ml/process-document`
- **Purpose**: Ingest PDF and generate the final exam.
- **Input**: `UploadFile` (multipart/form-data).
- **Output**: JSON `{"concepts": [...], "questions": [...]}`.
- **Errors**: 400 if not a PDF or if text extraction fails.

### 2. `POST /api/ml/extract-concepts`
- **Purpose**: Parse student's raw explanation and save to memory.
- **Input**: JSON `{"explanation": "...", "user_id": "...", "source_concepts": [...]}`.
- **Output**: JSON `{"extracted_concepts": [...]}`.
- **Function**: Appends to the global `MOCK_DB[user_id]` dictionary.

### 3. `POST /api/ml/retrieve-memory`
- **Purpose**: Child Agent answers a question based only on memory.
- **Input**: JSON `{"question": "...", "user_id": "..."}`.
- **Output**: JSON `{"answer": "..."}`.
- **Function**: Reads `MOCK_DB[user_id]`, builds context, prompts LLM.

### 4. `POST /api/ml/grade-answer`
- **Purpose**: Teacher Agent grades the Child's answer.
- **Input**: JSON `{"question": "...", "student_answer": "...", "expected_answer": "..."}`.
- **Output**: JSON `{"score": X, "feedback": "..."}`.

### Request Lifecycle
`Browser` → `FastAPI Router` → `Service Function` → `Ollama API (localhost:11434)` → `JSON Response` → `FastAPI` → `Browser`.
"""

files["10_DATA_FLOW.md"] = """# PART 10 — DATA FLOW

## A. Study Material Upload & Exam Generation
```text
[PDF File] -> (React UI) -> (FastAPI) -> (PyPDF2 Extractor) -> [Raw Text Chunk] -> (Llama 3.1) -> [10 JSON Questions] -> (React State: result.questions)
```

## B. Teaching Session & Knowledge Extraction
```text
[Spoken/Typed Text] -> (React UI) -> (FastAPI) -> (Llama 3.1) -> [Extracted JSON Concepts] -> (MOCK_DB Dictionary)
```

## C. Final Exam & Grading Loop (Runs 10 times)
```text
(React UI: loop) 
  -> Send Q to (FastAPI: retrieve-memory) 
  -> Build context from (MOCK_DB) 
  -> (Child Llama 3.1) 
  -> [Child Answer String] 
  
  -> Send Answer to (FastAPI: grade-answer)
  -> (Teacher Llama 3.1)
  -> [Score & Feedback JSON]
  
  -> (React State: examResults array)
```
"""

files["11_STORAGE_AND_DATA.md"] = """# PART 11 — DATABASE / STORAGE

## 1. MOCK_DB (Memory Storage)
- **What is it?**: A global Python dictionary in `ml_routes.py`.
- **Format**: `{"user_id": [{"name": "...", "definition": "..."}]}`.
- **Who writes**: `extract_concepts` endpoint.
- **Who reads**: `retrieve_memory` endpoint.
- **Persistence**: **NO.** All data is completely lost when the FastAPI server shuts down or restarts. (ChromaDB was originally planned but removed for Python 3.13 compatibility).

## 2. React State (Frontend Storage)
- **What is it?**: Standard React `useState` hooks.
- **What is stored?**: The extracted PDF text, the generated questions, the transcript of what the user taught, and the final grades.
- **Persistence**: **NO.** Lost on page refresh.

**Explicit Statement for Viva:** "Sir/Ma'am, the current prototype does NOT use a persistent database. Everything is held in runtime memory (React State and Python Dictionaries) for simplicity and speed of demonstration."
"""

for filename, content in files.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content)
