# Backend API Guide

## Overview
The backend is built with FastAPI in Python, providing a lightweight and fast REST API to support the frontend operations. It handles PDF parsing, communicates with the local AI model, and manages the temporary state of the agents.

## Core Files
- `frontend/api/routers/ml_routes.py`: Contains all the API endpoints and the in-memory database.
- `frontend/api/services/llm_service.py`: Handles all interactions with the LLM. It enforces strict JSON outputs and defines the prompt templates that differentiate the "Teacher" and "Child" agents.
- `frontend/api/services/pdf_service.py`: Uses `PyPDF2` to extract text content from uploaded PDFs.

## API Endpoints (`ml_routes.py`)

### `POST /process-document`
- **Purpose**: Processes the uploaded PDF.
- **Action**: Uses `pdf_service.py` to extract text. Calls `llm_service.py` to extract Ground Truth concepts and generate 10 final exam questions.

### `POST /extract-concepts`
- **Purpose**: Processes the student's explanation.
- **Action**: Compares the student's explanation against the Ground Truth concepts, assigns a confidence score, and saves this structured knowledge to the Child Agent's memory.

### `POST /retrieve-memory`
- **Purpose**: Generates the Child Agent's answer during the exam.
- **Action**: The Child Agent answers the given question using ONLY the text stored in its memory.

### `POST /grade-answer`
- **Purpose**: Evaluates the Child Agent's knowledge.
- **Action**: The Teacher Agent compares the Child's answer to the Expected Answer, assigning a score (0-100) and providing feedback.

## Storage limitations
> [!WARNING]
> **NO REAL DATABASE IS USED.** The backend uses a simple in-memory Python dictionary `MOCK_DB = {}` located in `api/routers/ml_routes.py`. All user data and agent memory is lost when the backend server restarts. Authentication is hardcoded to "test-user-123".
