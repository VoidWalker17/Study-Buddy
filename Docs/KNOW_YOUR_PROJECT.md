# KNOW_YOUR_PROJECT

This document explains the **"WHY"** behind every major technical decision. Examiners love it when you can justify your tech stack.

## 1. Why React and Vite?
*   **React:** Component-based architecture allows for reusable UI pieces. It manages state efficiently, which is crucial for a multi-step process (Upload -> Teach -> Evaluate).
*   **Vite:** Much faster than traditional Webpack/Create-React-App. It provides instantaneous Hot Module Replacement (HMR) during development, improving developer productivity.

## 2. Why FastAPI (Python)?
*   **Python:** The industry standard language for AI and Machine Learning. Libraries like PyPDF2 and LLM wrappers are native to Python.
*   **FastAPI:** 
    *   It is natively asynchronous (`async def`), which is perfect for waiting on slow LLM responses without blocking the server.
    *   It uses Pydantic for data validation, ensuring the frontend sends the right payloads.
    *   It auto-generates API documentation (Swagger).

## 3. Why a Local LLM (Ollama / Llama 3.1)?
*   **Cost:** Free to run. No API costs associated with OpenAI or Anthropic.
*   **Privacy:** The PDF data and student explanations never leave the local machine. Highly secure.
*   **Control:** We can experiment with system prompts without worrying about rate limits.

## 4. Why an In-Memory Dictionary (`MOCK_DB`) instead of a real DB?
*   **Scope:** The core complexity of this project is the Agent Isolation Architecture, not CRUD operations.
*   **Simplicity:** A dictionary `MOCK_DB = {}` allows for rapid prototyping of the AI pipeline. Setting up PostgreSQL would add overhead for an MVP. We acknowledge this as a limitation.

## 5. Why custom prompts over LangChain/AutoGen?
*   **Transparency:** By writing the prompts directly in `llm_service.py`, we know exactly what is being sent to the model. Frameworks often hide the underlying prompts.
*   **Lightweight:** We only needed two distinct agent roles (Teacher and Child). Bringing in LangChain would be over-engineering for a simple sequential flow.

## 6. How is Agent Isolation Achieved?
The core innovation is ensuring the Child Agent doesn't use its pre-trained knowledge to cheat on the exam. 
This is achieved via **Prompt Injection Restriction**. 
We wrap the student's knowledge in special tags and instruct the LLM: 
*"You are a child. Answer the following question. You must ONLY use the information provided in the context. If the answer is not in the context, output exactly 'I don't know'."*
By not passing the ground truth to this specific API call, isolation is guaranteed.
