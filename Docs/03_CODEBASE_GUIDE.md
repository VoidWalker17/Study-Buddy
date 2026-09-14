# Study Buddy - Codebase Guide

This document maps out the core files responsible for the application's functionality.

## Frontend Files

*   `frontend/src/pages/StudyTool.tsx`
    *   **Role**: The main user interface and orchestration layer.
    *   **Responsibilities**:
        *   Manages the 3-step UI flow: 1. Upload PDF, 2. Teach Agent, 3. Evaluate.
        *   Contains the logic for iterating through exam questions and triggering the Child Agent's answers and Teacher Agent's grading.
        *   Handles the "Download PDF" functionality (using `jsPDF`) to export the generated questions.

## Backend Files (FastAPI)

*   `api/routers/ml_routes.py`
    *   **Role**: The primary API controller routing frontend requests to backend services.
    *   **Key State**: Contains the `MOCK_DB = {}` in-memory dictionary.
    *   **Endpoints**:
        *   `/process-document`: Handles PDF upload, text extraction, and initial Teacher Agent processing.
        *   `/extract-concepts`: Processes the user's teaching input and saves to `MOCK_DB`.
        *   `/retrieve-memory`: Triggers the Child Agent to answer a question using `MOCK_DB`.
        *   `/grade-answer`: Triggers the Teacher Agent to grade the Child Agent's answer.

*   `api/services/llm_service.py`
    *   **Role**: The core AI logic layer.
    *   **Responsibilities**:
        *   Handles all interactions with the local Ollama instance (llama3.1) via the `openai` Python client.
        *   Contains and manages the prompt templates for both the Teacher Agent and the Child Agent.
        *   Strictly enforces JSON schema output from the LLM to ensure parseable data for the API responses.
        *   Implements the isolation mechanism by dynamically injecting `MOCK_DB` contents into the Child Agent's context.

*   `api/services/pdf_service.py`
    *   **Role**: Utility service for document parsing.
    *   **Responsibilities**:
        *   Uses `PyPDF2` to read uploaded PDF files and extract raw text for the LLM to process.
