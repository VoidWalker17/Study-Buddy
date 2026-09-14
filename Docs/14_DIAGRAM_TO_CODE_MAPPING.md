# Diagram to Code Mapping

This document maps the conceptual architecture and data flows of the Study Buddy application directly to the underlying codebase implementation.

## 1. Agent Architecture
- **Concept**: Teacher Agent & Child Agent
- **Code Mapping**: `frontend/api/services/llm_service.py`
- **Implementation Reality**: The system does not use AutoGen or LangChain. Both agents are simply specific prompt strings passed to the same underlying LLM (Ollama). The "Child Agent" is restricted by its prompt to only use provided context.

## 2. Memory & Database
- **Concept**: User profiles, Child Agent memory, Ground Truth concepts
- **Code Mapping**: `frontend/api/routers/ml_routes.py` -> `MOCK_DB = {}`
- **Implementation Reality**: No SQL or NoSQL database is provisioned. Everything is stored in an ephemeral Python dictionary. Hardcoded `"test-user-123"` is used as the key.

## 3. Document Parsing
- **Concept**: Extracting knowledge from uploaded materials
- **Code Mapping**: `frontend/api/services/pdf_service.py`
- **Implementation Reality**: Uses the `PyPDF2` library to linearly extract plain text from the uploaded PDF binary stream.

## 4. User Interface & Flow Control
- **Concept**: 3-Step Wizard (Upload -> Teach -> Evaluate)
- **Code Mapping**: `frontend/src/pages/StudyTool.tsx`
- **Implementation Reality**: A single complex React component manages the state for all three steps, orchestrating sequential calls to the FastAPI endpoints (`/process-document`, `/extract-concepts`, `/retrieve-memory`, `/grade-answer`) and calculating the final Efficacy Score.
