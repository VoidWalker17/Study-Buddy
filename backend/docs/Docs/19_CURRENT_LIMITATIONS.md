# Current Limitations

As an MVP (Minimum Viable Product) and academic project, Study Buddy has specific architectural and functional limitations. Being transparent about these during a viva demonstrates strong engineering awareness.

## 1. The `MOCK_DB` is Ephemeral
*   **Limitation:** There is no persistent database (like PostgreSQL or MongoDB). The Child Agent's memory is stored in an in-memory Python dictionary (`MOCK_DB = {}`) inside `ml_routes.py`.
*   **Impact:** If the FastAPI backend server restarts, crashes, or is redeployed, **all student progress and agent memory is permanently lost.**
*   **Future Fix:** Implement a real database (e.g., SQLite for local, PostgreSQL for cloud) and an ORM (like SQLAlchemy) to persist the structured knowledge graph.

## 2. Hardcoded User (No Authentication)
*   **Limitation:** The application relies on a hardcoded user ID (`test-user-123`).
*   **Impact:** It is effectively a single-user system. If deployed to the web in its current state, all users would overwrite each other's Agent Memory.
*   **Future Fix:** Integrate standard authentication (OAuth2, JWT) to assign unique Session IDs or User IDs to incoming requests.

## 3. Context Window and PDF Size Limits
*   **Limitation:** The system processes the entire PDF text in a single prompt to extract ground truth and generate questions.
*   **Impact:** If a user uploads a 50-page textbook, the extracted text will exceed the context window limit of the local LLM (llama3.1). This will result in an API error or truncated, incomplete knowledge extraction.
*   **Future Fix:** Implement RAG (Retrieval-Augmented Generation) using a vector database (like ChromaDB or FAISS) to chunk the PDF and only load relevant sections into the prompt.

## 4. LLM Prompt Fragility
*   **Limitation:** The entire application logic (grading, extraction, isolation) relies heavily on prompt adherence. 
*   **Impact:** Smaller local models (like 8B parameter models) occasionally ignore instructions. They might output markdown when strictly asked for JSON, or hallucinate external knowledge during the exam phase despite being told to only use the `MOCK_DB` context.
*   **Future Fix:** Implement structured outputs (e.g., using Instructor or Outlines libraries) to force the LLM to adhere to Pydantic schemas at the token generation level.

## 5. Lack of State Persistence on Refresh
*   **Limitation:** The React frontend state in `StudyTool.tsx` is lost if the user refreshes the browser page.
*   **Impact:** The user will be kicked back to the "Upload PDF" step even if they were in the middle of an exam.
*   **Future Fix:** Sync frontend state with `localStorage` or maintain a server-side session state.
