# Viva Guide: Classes, Components, and Models

In modern web development stacks like React (Frontend) and FastAPI (Backend), traditional Object-Oriented Programming (OOP) with heavy class hierarchies is often replaced by Functional Programming patterns and Data Models. 

Here is how "classes" and structural concepts map to the Study Buddy project.

## 1. Frontend: React Functional Components
Instead of using React Class Components, the frontend uses modern React Functional Components with Hooks.

*   **`StudyTool` (Conceptually the Main Application Class)**
    *   **Location:** `frontend/src/pages/StudyTool.tsx`
    *   **Role:** Acts as the main controller. It manages the state for all three phases (Upload, Teach, Evaluate). 
    *   **Why Functional?** React hooks (`useState`, `useEffect`) allow for cleaner state management without the boilerplate of traditional class lifecycle methods (like `componentDidMount`).

## 2. Backend: Pydantic Data Models (The "Classes" of FastAPI)
In FastAPI, we use Pydantic models. These behave like Data Transfer Object (DTO) classes. They validate the data coming from the frontend and enforce strict typing.

*   **`GradeAnswerRequest`**
    *   **Role:** A Pydantic class that defines what data is required to grade an answer.
    *   **Attributes:** Typically includes the student's answer, the expected answer, and the question context.
    *   **Why Use It?** It automatically validates incoming JSON requests and returns a 422 Error if the frontend sends incorrect data.

*   **`ProcessDocumentRequest` & `ExtractConceptsRequest`**
    *   **Role:** Request classes that structure the inputs for document uploading and concept extraction API endpoints.

## 3. Backend: Services (Modules instead of Singleton Classes)
Instead of creating singleton classes like `class LLMManager`, the backend uses Python modules grouping related functions.

*   **`llm_service.py`**
    *   **Role:** Acts as the AI service layer. Contains functions for prompting the local Ollama instance (using the OpenAI API format).
*   **`pdf_service.py`**
    *   **Role:** Handles all PDF parsing logic using `PyPDF2`.

**Viva Tip:** If asked, "Where are your classes?", explain that the architecture favors **Functional Components in React** for UI state, and **Pydantic Models in FastAPI** for data validation, which is the industry standard for this stack.
