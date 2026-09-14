# Important Functions and Endpoints

This document outlines the core functional blocks of the Study Buddy system. 

## Backend API Endpoints (`api/routers/ml_routes.py`)

1.  **`/process-document` (POST)**
    *   **Purpose:** Handles the initial PDF upload.
    *   **Flow:** Uses `pdf_service` to extract text from the PDF. Passes the text to `llm_service` to extract Ground Truth concepts and generate 10 final exam questions.

2.  **`/extract-concepts` (POST)**
    *   **Purpose:** Processes the student's teaching inputs.
    *   **Flow:** Takes the text/voice explanation from the user. Uses the LLM to extract concepts, compares them against the Ground Truth, and assigns a confidence score. Stores this in the `MOCK_DB`.

3.  **`/retrieve-memory` (GET/POST)**
    *   **Purpose:** Fetches what the "Child Agent" has learned.
    *   **Flow:** When a question is asked during the exam phase, this endpoint queries the `MOCK_DB` to construct an answer based *only* on the concepts the student successfully taught.

4.  **`/grade-answer` (POST)**
    *   **Purpose:** Evaluates the Child Agent's exam performance.
    *   **Flow:** The "Teacher Agent" (an LLM prompt) compares the Child's answer against the actual Expected Answer. Returns a score (0-100) and specific feedback.

## Core Service Functions (`api/services/llm_service.py`)

1.  **`extract_ground_truth(text: str)`**
    *   Analyzes raw PDF text and structures it into core concepts. Enforces strict JSON output.

2.  **`generate_questions(concepts: list)`**
    *   Creates the 10 final exam questions based on the extracted ground truth.

3.  **`evaluate_teaching(student_explanation: str, ground_truth: list)`**
    *   The core logic for the "Teach" phase. Determines how well the student explained the concept and updates the Child Agent's memory.

4.  **`grade_child_answer(child_answer: str, expected_answer: str)`**
    *   The core logic for the final evaluation phase.

## Frontend Key Functions (`frontend/src/pages/StudyTool.tsx`)

1.  **`handleFileUpload(file: File)`**
    *   Sends the PDF to `/process-document` and transitions the UI to the Teaching Phase.

2.  **`submitTeaching(explanation: str)`**
    *   Sends user text/voice input to `/extract-concepts`. Updates local state with the system's feedback.

3.  **`runExam()`**
    *   Iterates through the generated questions, calls `/retrieve-memory` to get the Child's answer, and then calls `/grade-answer` to calculate the final Efficacy Score.
