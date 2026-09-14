# Teacher Agent

## Overview
The Teacher Agent in the Study Buddy project is a logical role, rather than a standalone complex agent framework (like LangChain or AutoGen). It is implemented through specific prompt templates located in `api/services/llm_service.py` and relies on a local Ollama (llama3.1) instance via the OpenAI API format.

## Responsibilities
The Teacher Agent handles the authoritative and evaluative tasks in the system:

1. **Ground Truth Extraction & Question Generation**:
   When a user uploads a PDF, the Teacher Agent processes the text (extracted via `pdf_service.py`). It extracts the core ground truth concepts and generates exactly 10 final exam questions based on the material.

2. **Grading and Evaluation**:
   During the exam phase (Step 3 in `StudyTool.tsx`), the Teacher Agent evaluates the Child Agent's answers. By calling the `/grade-answer` endpoint in `api/routers/ml_routes.py`, it compares the Child Agent's response to the expected ground truth answer, outputs a score from 0 to 100, and provides targeted feedback.

## Implementation Details
- **No Agentic Framework**: The Teacher Agent is essentially a set of system prompts executed by `llm_service.py` that strictly enforce JSON formatting for structured outputs.
- **Stateless Prompts**: Each interaction with the Teacher Agent is self-contained. It receives the necessary context (e.g., ground truth + child answer) within the prompt and returns the evaluation.
