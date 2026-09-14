# Child Agent

## Overview
The Child Agent represents the "student" being taught by the user. Like the Teacher Agent, it is not built on complex agent frameworks. Instead, it is a logical construct implemented via prompt templates in `api/services/llm_service.py` querying the same underlying LLM (local Ollama llama3.1).

## Responsibilities
The primary role of the Child Agent is to attempt the final exam using *only* the knowledge it has been explicitly taught by the user.

1. **Learning**:
   During the Teaching phase (Step 2 in `StudyTool.tsx`), the user explains concepts. The system extracts this knowledge, evaluates it against the ground truth, and stores it in the system's memory.

2. **Taking the Exam**:
   During the evaluation phase, the Child Agent must answer the Teacher Agent's 10 questions. It relies exclusively on the `/retrieve-memory` endpoint to fetch context. 

## The Isolation Mechanism
A critical feature of the Child Agent is **knowledge isolation**.
- The Child Agent is completely restricted by its prompt context. 
- It does not have access to the original PDF or the full ground truth.
- When generating an answer, `llm_service.py` explicitly constructs a prompt that forces the LLM to rely *only* on the retrieved context stored in `MOCK_DB`. If a concept wasn't taught or was taught poorly, the Child Agent's answer will reflect that limitation, leading to a lower grade from the Teacher Agent.
