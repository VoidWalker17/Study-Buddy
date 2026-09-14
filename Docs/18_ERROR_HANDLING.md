# Error Handling Strategies

Robust error handling is necessary to maintain a smooth user experience, especially when dealing with unpredictable LLM outputs and file parsing.

## 1. LLM Output Errors (JSON Parsing)
The most common point of failure in AI applications is when the LLM returns plain text instead of the requested JSON structure.

*   **The Issue:** `llm_service.py` expects strict JSON (e.g., a list of generated questions). If the LLM includes conversational filler (e.g., "Here are your questions: [...]"), parsing fails.
*   **Handling Strategy:** 
    *   **Prompt Engineering:** Prompts explicitly demand `JSON ONLY` with no markdown formatting.
    *   **Try/Except Blocks:** The backend wraps `json.loads()` in a `try...except json.JSONDecodeError` block.
    *   **Fallback:** If parsing fails, the system logs the raw output for debugging and returns a standardized 500 API error to the frontend, indicating an "AI Generation Failure."

## 2. Document Processing Errors
PDFs can be complex, encrypted, or contain unreadable image-based text.

*   **The Issue:** `PyPDF2` in `pdf_service.py` might fail to read a file or extract 0 characters.
*   **Handling Strategy:**
    *   If `len(extracted_text) == 0`, the backend aborts the process and returns a 400 Bad Request: "Could not extract text from document. Please ensure it is a text-based PDF."
    *   Standard `try...except Exception` blocks catch corrupted file uploads.

## 3. Frontend Error States
The React frontend (`StudyTool.tsx`) must gracefully handle backend failures.

*   **The Issue:** The API takes too long, or returns a 500 error during the exam phase.
*   **Handling Strategy:**
    *   **Loading States:** UI uses loading spinners during all async calls to prevent user confusion.
    *   **Toast Notifications:** If an API call fails, the frontend catches the error and displays a non-intrusive toast notification (e.g., "Failed to grade answer. Please try again.").
    *   **Graceful Degradation:** If the backend completely fails, the frontend resets the phase rather than freezing.

## 4. "Memory Not Found" (Logic Error)
*   **The Issue:** The exam phase asks a question for which the student never taught a concept.
*   **Handling Strategy:** This is handled as a feature, not a bug. If the backend retrieves `None` from the `MOCK_DB` for a specific concept, the Child Agent's prompt is fed an empty context. The LLM then correctly responds that it does not know the answer, resulting in a low grade (0 score), which accurately reflects the student's failure to teach that topic.
