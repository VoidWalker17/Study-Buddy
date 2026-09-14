import os
docs_dir = "/Users/agarwaldivyansh/Documents/MY CODE/2026/Study-Buddy/docs"

files = {}

files["12_TECH_STACK.md"] = """# PART 12 — TECHNOLOGY STACK

## Technology Table

| Technology | Where Used | Why Used | Evidence in Code |
|---|---|---|---|
| **React + TypeScript** | Frontend UI | Component-based UI, static typing | `frontend/src/` |
| **Vite** | Frontend Build Tool | Fast hot-reloading | `frontend/vite.config.ts` |
| **Tailwind CSS v4** | Styling | Rapid utility-first styling | `tailwind.config.js`, `index.css` |
| **FastAPI** | Backend API | Fast Python routing | `frontend/api/index.py` |
| **PyPDF2** | PDF Parsing | Extract text from uploaded files | `frontend/api/services/pdf_service.py` |
| **Ollama (Llama 3.1)** | AI/LLM | Local inference, no API costs | `llm_service.py` (`DEFAULT_MODEL`) |
| **OpenAI Python SDK** | API Wrapper | Connects to Ollama's local endpoint | `llm_service.py` |
| **GSAP** | Animations | Smooth UI transitions | `LandingPage.tsx` |
| **jsPDF** | PDF Export | Export generated test papers | `StudyTool.tsx` |

## Viva Question: "Why did you choose this technology?"
"We chose React and Tailwind for a fast, modern user interface. We chose FastAPI for the backend because Python has the best ecosystem for AI and text processing (like PyPDF2). Finally, we chose Ollama running Llama 3.1 locally because it allows us to develop and test complex, multi-agent AI features completely free of charge without hitting rate limits or cloud API costs."
"""

files["13_ARCHITECTURE.md"] = """# PART 13 — ARCHITECTURE

## Actual Implemented Architecture

```text
                  STUDENT
                     | (Uploads PDF, Teaches via Web API)
                     v
           [ REACT FRONTEND UI ]
                     |
                     v
             [ FASTAPI BACKEND ]
               /             \
 (Extracts text)            (Saves memory)
             /                 \
            v                   v
   [ TEACHER AGENT ]      [ MOCK_DB (Memory) ]
    (Llama 3.1 prompt)          |
            |                   | (Context)
            v                   v
     [ GENERATES ]       [ CHILD AGENT ]
     [ 10 Qs & As]        (Llama 3.1 prompt)
            |                   |
            +-------> <---------+
                 (The Exam)
                     |
                     v
             [ EVALUATION ]
           (Teacher grades Child)
                     |
                     v
             [ FINAL SCORE ]
```

**Explanation:**
1. The Student interacts purely with the React Frontend.
2. The Frontend routes data to the FastAPI Backend.
3. The Backend acts as the orchestrator.
4. When a PDF arrives, the Backend calls the Teacher Agent (LLM) to generate Questions.
5. When the student teaches, the Backend saves structured JSON to `MOCK_DB`.
6. During the exam, the Backend builds a prompt using `MOCK_DB` and sends it to the Child Agent (LLM).
7. The Child's answer is routed back to the Teacher Agent (LLM) for grading.
"""

files["14_DIAGRAM_TO_CODE_MAPPING.md"] = """# PART 14 — DIAGRAM TO CODE MAPPING

*(Note: Use this guide to defend your standard UML/Software Engineering diagrams in the viva.)*

## 1. DFD Level 0 (Context Diagram)
- **Diagram shows**: User -> System -> Results.
- **Code implementation**: User interacts with `StudyTool.tsx`. System is the whole app. Results are the `examResults` state array.

## 2. Use Case Diagram
- **Use Case "Upload Material"**: Handled by `ml_routes.py` -> `process_document`.
- **Use Case "Teach Agent"**: Handled by `ml_routes.py` -> `extract_concepts`.
- **Use Case "View Score"**: Rendered in `StudyTool.tsx` (Step 3).

## 3. Class Diagram
- **Diagram vs Reality**: Modern React and FastAPI rely heavily on functional programming and stateless routing rather than strict Object-Oriented Programming. 
- **Mapping**: If your diagram shows a `Teacher` class and `Child` class, explain that in the codebase, these are actually **stateless service functions** (`llm_service.py`) that adopt a "Teacher persona" or "Child persona" via prompt engineering, rather than stateful Python objects.

## 4. Sequence Diagram (The Exam Flow)
- **Diagram shows**: User clicks Start -> System asks Child -> System asks Teacher -> Returns score.
- **Code implementation**: Look at the `runExam()` function inside `StudyTool.tsx`. You will literally see a `for` loop mapping exactly to this sequence, making `await axios.post('/api/ml/retrieve-memory')` followed by `await axios.post('/api/ml/grade-answer')`.

## 5. Mismatches (Honesty is good in viva)
- If your diagrams show a database (like MySQL or MongoDB), you must admit: "Sir, for the prototype, we replaced the persistent database with an in-memory dictionary (`MOCK_DB`) to ensure compatibility and speed on local hardware."
"""

files["15_CLASS_VIVA_GUIDE.md"] = """# PART 15 — CLASS-BY-CLASS VIVA GUIDE

*Note: This project is heavily functional (React Hooks + FastAPI routes), but uses Pydantic Models as "classes" for data validation.*

## 1. Class: `ExtractConceptsRequest`
- **Location**: `ml_routes.py`
- **Purpose**: Validates incoming teaching data.
- **Attributes**: `explanation` (str), `user_id` (str), `source_concepts` (list).
- **Why it exists**: Pydantic models automatically validate JSON payloads from the frontend. If the frontend sends bad data, FastAPI automatically returns a 422 Error without crashing the server.

## 2. Class: `GradeAnswerRequest`
- **Location**: `ml_routes.py`
- **Purpose**: Validates incoming grading data during the exam loop.
- **Attributes**: `question`, `student_answer`, `expected_answer`.
- **Why are these separated?**: It enforces strict separation of concerns. `GradeAnswerRequest` doesn't care who the user is; it only cares about the texts it needs to compare.

## 3. Concept: The "Agents" aren't OOP Classes
- **Viva Trick Question**: "Show me the `TeacherAgent` class."
- **Answer**: "Sir, we did not use OOP classes for the agents because LLMs are stateless by nature. Instead, the 'Agent' is defined by its system prompt inside the functional module `llm_service.py`. The state is held in the React frontend and the `MOCK_DB` dictionary, not in a class object."
"""

files["16_IMPORTANT_FUNCTIONS.md"] = """# PART 16 — FUNCTION-BY-FUNCTION IMPORTANT CODE

## CRITICAL (Know for Viva)

### 1. `runExam()`
- **File**: `frontend/src/pages/StudyTool.tsx`
- **Purpose**: Orchestrates the final evaluation.
- **Simple Explanation**: Loops through the 10 generated questions, asks the backend to fetch the Child's answer, then asks the backend to grade it, and saves the result.

### 2. `generate_questions_from_concepts(concepts)`
- **File**: `frontend/api/services/llm_service.py`
- **Purpose**: Teacher Agent generating the exam.
- **Simple Explanation**: Takes concepts from the PDF, prompts Llama 3.1 to create 10 difficult questions requiring 2-3 sentence answers, and enforces strict JSON output.

### 3. `retrieve_memory(req)`
- **File**: `frontend/api/routers/ml_routes.py`
- **Purpose**: Child Agent answering questions.
- **Simple Explanation**: Looks up the user's taught concepts in `MOCK_DB`, builds a strictly isolated context string, and prompts the LLM to answer the question using *only* that string.

## IMPORTANT

### 4. `extract_student_explanation_concepts(explanation)`
- **File**: `frontend/api/services/llm_service.py`
- **Purpose**: The Memory Engine.
- **Simple Explanation**: Reads the student's messy spoken/typed text and turns it into clean JSON concept objects.

### 5. `process_document(file)`
- **File**: `frontend/api/routers/ml_routes.py`
- **Purpose**: Entrypoint for PDF uploads.
- **Simple Explanation**: Extracts text via PyPDF2, chunks it, extracts concepts, and generates the exam in one go.
"""

files["17_SECURITY_AND_ISOLATION.md"] = """# PART 17 — SECURITY / ISOLATION

## 1. Agent Isolation (CRITICAL FEATURE)
- **Claim**: The Child Agent never sees the source PDF.
- **Implementation**: True. In `retrieve_memory` (`ml_routes.py`), the prompt sent to the LLM is constructed using *only* the contents of `MOCK_DB` (what the student taught). The text from the PDF is strictly out of scope. Because LLM calls are stateless REST requests, the model physically cannot remember the PDF it processed earlier.

## 2. API Key Protection
- **Implementation**: The LLM relies on local Ollama (`localhost:11434`), which doesn't require a real API key. The code defaults to `"ollama"`.

## 3. Data Privacy
- **Implementation**: Because the LLM runs locally (Llama 3.1 8B), absolutely no user PDFs or spoken explanations are sent to the cloud. Total privacy is achieved.

## 4. Authentication / Unauthorized Access
- **Implementation**: **Not implemented in current prototype.** There is no login system, JWT, or database. `user_id` is mocked/passed loosely.

## 5. Input Validation
- **Implementation**: Pydantic models in FastAPI enforce basic type checking. The PDF route actively checks `if not file.filename.endswith('.pdf')`. Prompt injection is technically possible as we do not sanitize the student's raw text before sending it to the LLM.
"""

for filename, content in files.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content)
