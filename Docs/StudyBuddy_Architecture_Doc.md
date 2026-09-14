# Study Buddy AI - Project Documentation
**"You teach the AI. It takes the exam."**

## 1. Project Overview
Study Buddy is an innovative educational tool that flips the traditional learning model. Instead of the AI tutoring the student, the **student tutors the AI**. 
By teaching a "Child Agent" a topic in their own words, students reinforce their own understanding (the Feynman Technique). The system then tests how well the student taught the AI by administering an exam to the Child Agent and grading its performance.

---

## 2. Core Architecture: The Dual-Agent System
The platform operates on a localized, offline AI architecture utilizing **Llama 3.1 (8B)** via Ollama. It relies on two distinct AI agents acting in completely different roles:

### A. The Teacher Model (Privileged Agent)
*   **Role:** The examiner and the source of absolute truth.
*   **Capabilities:** It has full access to the source material (PDF/PPT) uploaded by the user.
*   **Responsibilities:** 
    *   Parses the document and extracts the core syllabus concepts.
    *   Generates 10 high-difficulty, long-form conceptual questions based on the text.
    *   Acts as the final grader during the exam phase.

### B. The Student Model / Child Agent (Restricted Agent)
*   **Role:** The blank slate.
*   **Capabilities:** It has **zero access** to the original PDF. 
*   **Responsibilities:**
    *   It relies *entirely* on the text/voice explanations provided by the user during the "Knowledge Transfer" phase.
    *   It attempts to answer the Teacher's questions using only the limited memory the user taught it.

---

## 3. Technical Stack
*   **Frontend Interface:** React 19, Vite, Tailwind CSS v4.
*   **UI/UX & Animations:** GSAP (ScrollTrigger/animations), `lucide-react` (icons), Glassmorphism styling.
*   **PDF Generation:** `jspdf` for exporting the Teacher's exam paper.
*   **Backend API:** Python, FastAPI, `uvicorn`.
*   **Document Parsing:** `PyPDF2` for chunking and extracting text.
*   **AI Engine (Local):** `ollama` running **Llama 3.1**. We enforce strict JSON schemas (`response_format={"type": "json_object"}`) to ensure the AI returns machine-readable data.

---

## 4. Step-by-Step Code Flow & Working

### Phase 1: Upload Source
**File:** `frontend/src/pages/StudyTool.tsx` -> `handleFileUpload`
*   The user uploads a PDF. 
*   The frontend sends it to `POST /api/ml/process-document`.
*   The backend extracts text and uses the **Teacher Model** to generate 10 questions and extract key concepts. 
*   These questions are cached in the frontend state. The user can view them or download them as an Exam PDF.

### Phase 2: Knowledge Transfer
**File:** `frontend/src/pages/StudyTool.tsx` -> `handleTeach`
*   The user types or uses Voice Dictation (`react-speech-recognition`) to explain the topic.
*   The frontend sends this raw explanation to `POST /api/ml/extract-concepts`.
*   The backend evaluates the user's explanation, extracts the concepts they successfully taught, and assigns a "confidence score". This populates the **Child Agent's Memory**.

### Phase 3: Neural Evaluation (The Exam)
**File:** `frontend/src/pages/StudyTool.tsx` -> `runExam`
*   The frontend loops through the 10 questions generated in Phase 1.
*   For each question:
    1.  **Child Answers:** The frontend calls `POST /api/ml/retrieve-memory`. The Child Agent attempts to answer the question using *only* the taught concepts.
    2.  **Teacher Grades:** The frontend calls `POST /api/ml/grade-answer`. The Teacher Model compares the Child's answer to the true expected answer and gives it a score (0-100) and feedback.
*   Finally, the frontend aggregates the scores, calculates the user's "Overall Teaching Score", and renders the Teacher's feedback for every question.
