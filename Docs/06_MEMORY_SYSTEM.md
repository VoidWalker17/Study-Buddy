# Memory System

## Overview
The Memory System in the Study Buddy project is designed to store the structured knowledge that the user teaches the Child Agent. 

## Implementation Reality: `MOCK_DB`
It is crucial to note that **there is no real database** connected to the application.
- The storage mechanism is purely an in-memory Python dictionary defined as `MOCK_DB = {}` inside `api/routers/ml_routes.py`.
- **Volatility**: Because it is in-memory, all taught concepts and generated questions are completely lost if the FastAPI backend restarts.
- **Authentication**: There is no user authentication. The system uses a hardcoded user identifier (`"test-user-123"`) to map data in the dictionary.

## Data Flow
1. **Storing Memory (`/extract-concepts`)**: When the user provides an explanation (via text or voice), the LLM extracts concepts and compares them to the ground truth. This extracted, structured knowledge (along with a confidence score) is appended to `MOCK_DB["test-user-123"]`.
2. **Retrieving Memory (`/retrieve-memory`)**: When the Child Agent is asked a question during the exam phase, this endpoint fetches the relevant taught concepts from `MOCK_DB` so the Child Agent can construct its answer.
