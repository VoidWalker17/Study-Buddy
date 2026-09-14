# Study Buddy - Data Flow

This diagram outlines the flow of data through the Study Buddy system, highlighting the lack of persistent storage and the reliance on in-memory state.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as frontend/src/pages/StudyTool.tsx
    participant ML_Routes as api/routers/ml_routes.py
    participant LLM_Service as api/services/llm_service.py
    participant MOCK_DB as MOCK_DB (In-Memory)
    participant Ollama as Local Ollama (llama3.1)

    %% Step 1: Upload
    User->>Frontend: Uploads PDF
    Frontend->>ML_Routes: POST /process-document
    ML_Routes->>LLM_Service: Extract Concepts & Generate Questions
    LLM_Service->>Ollama: Prompt (Teacher Agent)
    Ollama-->>LLM_Service: JSON (Concepts + 10 Questions)
    LLM_Service-->>ML_Routes: Parsed JSON
    ML_Routes-->>Frontend: Concepts & Questions (Kept in React State)

    %% Step 2: Teach
    User->>Frontend: Teaches a Concept
    Frontend->>ML_Routes: POST /extract-concepts (User Explanation)
    ML_Routes->>LLM_Service: Evaluate Explanation vs Ground Truth
    LLM_Service->>Ollama: Prompt
    Ollama-->>LLM_Service: JSON (Extracted Knowledge + Confidence)
    LLM_Service-->>ML_Routes: Knowledge Graph Data
    ML_Routes->>MOCK_DB: Save Knowledge (Key: 'test-user-123')
    ML_Routes-->>Frontend: Success Response

    %% Step 3: Exam (Retrieve Memory)
    Frontend->>ML_Routes: POST /retrieve-memory (Question)
    ML_Routes->>MOCK_DB: Fetch Knowledge for 'test-user-123'
    MOCK_DB-->>ML_Routes: Taught Concepts
    ML_Routes->>LLM_Service: Generate Answer (Restricted Context)
    LLM_Service->>Ollama: Prompt (Child Agent + MOCK_DB Context)
    Ollama-->>LLM_Service: Answer String
    LLM_Service-->>ML_Routes: Child Answer
    ML_Routes-->>Frontend: Child Answer

    %% Step 4: Grade
    Frontend->>ML_Routes: POST /grade-answer (Child Answer + Expected Answer)
    ML_Routes->>LLM_Service: Evaluate Answer
    LLM_Service->>Ollama: Prompt (Teacher Agent Grading)
    Ollama-->>LLM_Service: JSON (Score 0-100 + Feedback)
    LLM_Service-->>ML_Routes: Grade Data
    ML_Routes-->>Frontend: Grade Data
    Frontend->>Frontend: Calculate Average Score (Efficacy)
```

## Key Takeaways
1.  **Statelessness**: The FastAPI server relies entirely on `MOCK_DB` in `ml_routes.py`. A server restart wipes the Child Agent's memory.
2.  **Frontend Orchestration**: The frontend (`StudyTool.tsx`) holds the state of the generated questions and iterates through them during the exam phase, passing the necessary data back to the backend for grading.
3.  **Agent Isolation**: The separation between Teacher and Child agents happens entirely in `LLM_Service` via prompt construction. The Child Agent's prompt explicitly injects the data retrieved from `MOCK_DB`.
