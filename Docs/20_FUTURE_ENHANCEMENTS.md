# 20_FUTURE_ENHANCEMENTS

If the examiner asks: "What would you improve in this project if you had more time?", refer to this document. Be honest that the current version is a prototype (MVP).

## 1. Database Integration
*   **Current State:** We use an in-memory Python dictionary (`MOCK_DB = {}`) in `api/routers/ml_routes.py`. It resets every time the server restarts.
*   **Enhancement:** Integrate a real database. 
    *   Use PostgreSQL (relational) to store user accounts, sessions, and historical exam scores.
    *   Use MongoDB (NoSQL) for storing the JSON outputs from the LLM, agent memory, and generated questions.

## 2. Authentication & Authorization
*   **Current State:** We use a hardcoded user ID (`test-user-123`). There is no login system.
*   **Enhancement:** Implement JWT (JSON Web Tokens) or OAuth (Google/GitHub login) to allow multiple students to use the platform simultaneously without overwriting each other's data.

## 3. RAG (Retrieval-Augmented Generation) for Large PDFs
*   **Current State:** We extract text using PyPDF2 and stuff it into the LLM prompt. If the PDF is too large, it will exceed the context window of Ollama (llama3.1).
*   **Enhancement:** Implement a true RAG pipeline.
    *   Chunk the PDF text into smaller segments.
    *   Use an embedding model (like `nomic-embed-text`) to convert chunks into vectors.
    *   Store them in a Vector Database (like ChromaDB, FAISS, or Pinecone).
    *   Retrieve only the relevant chunks when generating questions or evaluating answers.

## 4. Proper Agentic Frameworks
*   **Current State:** Agents are just logical concepts. "Teacher" and "Child" are just different prompt templates hitting the same LLM sequentially in `llm_service.py`.
*   **Enhancement:** Use frameworks like LangChain, LlamaIndex, or AutoGen. This would allow agents to have tools (like web search), persistent memory buffers, and more complex routing/reasoning (ReAct prompting).

## 5. Voice Interaction
*   **Current State:** The user types out their explanation to teach the agent (though they can use browser dictation).
*   **Enhancement:** Integrate OpenAI's Whisper API or a local equivalent for seamless Speech-to-Text, and TTS (Text-to-Speech) for the Child Agent's responses.

## 6. Containerization & Deployment
*   **Current State:** Runs locally on the dev machine (Vite dev server + Uvicorn).
*   **Enhancement:** 
    *   Dockerize the application (one container for frontend, one for backend).
    *   Host the frontend on Vercel or Netlify.
    *   Host the FastAPI backend on AWS EC2, Render, or Railway.
