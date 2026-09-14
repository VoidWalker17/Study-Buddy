import os
docs_dir = "/Users/agarwaldivyansh/Documents/MY CODE/2026/Study-Buddy/docs"

files = {}

files["18_ERROR_HANDLING.md"] = """# PART 18 — ERROR HANDLING

## How the Application Handles Failures

1. **Invalid File Upload**: 
   - *Backend*: Checks `endswith('.pdf')` and raises HTTP 400.
   - *Frontend*: Shows an alert.
2. **LLM Failure / Rate Limits**:
   - *Backend*: `llm_service.py` wraps `client.chat.completions.create` in a `try-except` block. If Ollama crashes, it prints an error and returns an empty string `""`.
3. **Invalid JSON Responses (Hallucinations)**:
   - *Backend*: Even with `response_format={"type": "json_object"}`, the LLM sometimes adds markdown block formatting (` ```json ... ``` `). 
   - *Fix*: The `clean_json()` function strips these markdown blocks before `json.loads` is called. If `json.loads` still fails, it catches `json.JSONDecodeError` and returns safe empty dicts/lists to prevent server crash.
4. **Empty Teaching Input**:
   - *Frontend*: The `handleTeach` function checks if `explanation.trim()` is empty and refuses to send the request.
"""

files["19_CURRENT_LIMITATIONS.md"] = """# PART 19 — CURRENT LIMITATIONS

## Safe Viva Answers for Limitations

**A. Prototype Limitations (Speed vs Quality)**
"Currently, to keep the application responsive for a live demo on local hardware, we only process the *first chunk* (2000 characters) of the uploaded PDF. A production version would process the entire document using a robust RAG (Retrieval-Augmented Generation) pipeline."

**B. Missing Features (Storage)**
"The memory system (`MOCK_DB`) is currently stored in volatile Python memory. If the server restarts, all student teaching data is lost. We originally planned to use ChromaDB, but faced Python 3.13 compatibility issues, so we built an in-memory mock for the prototype."

**C. Technical Limitations (LLM Speed)**
"Because we are running Llama 3.1 8B locally on a laptop (M1 Mac), the generation speed is slower than cloud APIs like OpenAI. Generating the 10 exam questions takes a few moments, which is why we implemented robust UI loading states."
"""

files["20_FUTURE_ENHANCEMENTS.md"] = """# PART 20 — FUTURE ENHANCEMENTS

## Realistic Future Improvements

1. **Vector Database Integration (RAG)**
   - **Why**: To process 100-page textbooks instead of just 1 page of notes.
   - **Approach**: Replace `MOCK_DB` with Pinecone or ChromaDB. Chunk the PDF, store embeddings, and retrieve only relevant chunks when generating questions.

2. **User Authentication & Persistent Profiles**
   - **Why**: So students can track their Teaching Efficacy Scores over a semester.
   - **Approach**: Add PostgreSQL and JWT authentication to FastAPI. Store historical scores and `MOCK_DB` concepts in the relational DB.

3. **Interactive Child Agent Queries**
   - **Why**: Currently the Child Agent only speaks during the exam. It would be better if the Child Agent could ask the student clarifying questions *during* the teaching phase ("I didn't understand the second part, can you explain?").
   - **Approach**: Add a chat interface in Step 2.
"""

files["VIVA_PREPARATION.md"] = """# PART 21 & 22 — VIVA PREPARATION & TRICK QUESTIONS

## TRICK QUESTIONS (Teacher checking if you actually know the code)

**Q: Why did you use two agents?**
*Answer:* We need isolation to ensure academic integrity. If we used one agent, it would already "know" the answers from reading the PDF. By splitting it, the Child Agent starts with zero knowledge and can only answer based on what the student teaches it, allowing us to evaluate the student indirectly.

**Q: How do you prevent the Child Agent from seeing the source material? Where is the isolation implemented?**
*Answer:* Isolation is implemented in `frontend/api/routers/ml_routes.py` inside the `retrieve_memory` function. When we prompt the Child Agent, we only pass it a context string built from `MOCK_DB` (the extracted student memory). Because LLM API calls are stateless, the model physically has no memory of the PDF that was uploaded earlier.

**Q: What happens if the LLM returns invalid JSON?**
*Answer:* In `llm_service.py`, we explicitly request JSON format, but we also pass the result through a `clean_json()` function to strip any markdown code blocks. We wrap the `json.loads` in a try-except block. If it fails, it returns an empty list or dict so the server doesn't crash.

**Q: Where is the Teaching Efficacy Score calculated?**
*Answer:* It is calculated on the frontend in `StudyTool.tsx`. After the exam loop finishes, React reduces the `examResults` array, sums up the scores, and divides by the total number of questions to get the average score.

**Q: If the LLM is removed, what parts of your system still work?**
*Answer:* Only the UI rendering, PDF file reading, and Voice-to-Text (which uses browser APIs). The entire core logic—extracting concepts, generating questions, answering them, and grading them—relies entirely on the LLM.

## TOP 10 LIKELY QUESTIONS

1. **What is your project?** -> An AI tool where you learn by teaching a blank-slate AI, and get graded on how well it learned.
2. **Which model are you using?** -> Llama 3.1 8B, running completely locally via Ollama.
3. **What is the backend framework?** -> FastAPI (Python).
4. **What is the frontend framework?** -> React with Vite and Tailwind CSS.
5. **How does voice input work?** -> It uses the native Web Speech API built into browsers like Google Chrome, specifically via the `react-speech-recognition` library.
6. **How does memory persist?** -> Currently, it doesn't. It's stored in a volatile Python dictionary (`MOCK_DB`) for the prototype.
7. **What is the most important file?** -> `llm_service.py` contains all the AI logic and prompts. `StudyTool.tsx` orchestrates the UI.
8. **What happens when I click "Start Exam"?** -> The React frontend loops 10 times. It asks the Child Agent a question, gets the answer, and immediately sends that answer to the Teacher Agent for grading.
9. **How are PDFs parsed?** -> Using the `PyPDF2` library in python.
10. **Why local models?** -> For complete data privacy and to avoid cloud API rate limits or costs.

*(Note: These cover the most critical technical aspects that examiners target).*
"""

files["BEGINNER_CODE_WALKTHROUGH.md"] = """# PART 23 — EXPLAIN THE CODE TO ME LIKE I'M NEW

## How to trace the code:

1. **The Entry Point (UI)**: Start by looking at `frontend/src/pages/StudyTool.tsx`. This file controls what the user sees.
2. **The Upload**: When you upload a file, look at `handleFileUpload` in that file. It sends a request to `/api/ml/process-document`.
3. **The Backend Router**: Open `frontend/api/routers/ml_routes.py` and find `def process_document`. You'll see it extracts text, and calls `generate_questions_from_concepts`.
4. **The Brain**: Open `frontend/api/services/llm_service.py`. This is the "Brain". Find `generate_questions_from_concepts`. You will see the exact English prompt sent to the Llama model telling it to generate 10 questions.
5. **The Memory**: Go back to `ml_routes.py`. Find the variable `MOCK_DB = {}`. This is literally just a Python dictionary holding data.
6. **The Teaching**: When the student talks, the frontend sends text to `extract-concepts` in `ml_routes.py`. It calls the "Brain" to convert the text to JSON, and saves it in `MOCK_DB`.
7. **The Exam**: In `StudyTool.tsx`, look at the `runExam` function. It's a `for` loop. It asks the backend (`retrieve-memory`) for an answer, and then asks the backend (`grade-answer`) for a grade.
"""

for filename, content in files.items():
    with open(os.path.join(docs_dir, filename), "w") as f:
        f.write(content)
