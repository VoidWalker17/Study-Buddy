# VIVA_CRASH_SHEET

**Memorize this page before you walk into the Viva.**

## 1. The Core Idea (The Elevator Pitch)
"Study Buddy is an AI-powered learning tool using the Feynman Technique. Instead of the AI teaching the student, the *student teaches the AI*. The system extracts concepts from a PDF, asks the student to explain them, and then tests how well the student taught the AI by having the AI take an exam based *only* on the student's explanation."

## 2. Tech Stack (The What)
*   **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, GSAP (animations), Lucide React (icons), jsPDF (PDF generation).
*   **Backend:** FastAPI (Python). Fast, async, auto-generates docs (Swagger).
*   **AI:** Local Ollama running `llama3.1`, accessed via the OpenAI Python client format.
*   **Storage:** In-memory Python Dictionary (`MOCK_DB`). *No real DB.*

## 3. Data Flow (The How)
1.  **Upload:** User uploads PDF. `ml_routes.py` -> `pdf_service.py` extracts text. `llm_service.py` extracts Ground Truth concepts & generates 10 exam questions.
2.  **Teach:** User explains concepts. System compares explanation to Ground Truth, gives confidence score, saves to `MOCK_DB`.
3.  **Exam:** UI asks for answers. Child Agent answers using *only* `MOCK_DB` context (`/retrieve-memory`).
4.  **Grade:** Teacher Agent compares Child's answer to Expected Answer. Returns Score (0-100) + Feedback. Efficacy = Average of 10 scores.

## 4. Agent Architecture (The "AI" Part)
*   **Are you using LangChain/AutoGen?** NO. 
*   **What are your agents then?** They are logical constructs achieved through *Prompt Engineering*. We have a Teacher Prompt and a Child Prompt in `llm_service.py`.
*   **How do you prevent the AI from cheating? (Isolation)**: We use strict prompt instructions. The Child Agent prompt explicitly states: "Use ONLY the provided memory context to answer. If the answer is not in the context, say 'I don't know'." The context passed is strictly what is stored in `MOCK_DB`.

## 5. Weaknesses / Limitations (Be Honest!)
*   If the PDF is huge (100 pages), the system will crash or truncate text because we don't have RAG/Vector DB. We stuff the whole text into the prompt.
*   No real database. If the backend restarts, all data is lost.
*   No real user login. Uses hardcoded `test-user-123`.

## 6. Your Role
If asked what you did: "I developed the full-stack pipeline, ensuring the strict isolation between the Teacher and Child agents via custom prompt engineering, and handled the data flow between the React frontend and FastAPI backend."
