# Tech Stack

The "Study Buddy" project utilizes the following technologies to achieve its goals without overly complex dependencies.

## Frontend
- **React**: Core UI library.
- **TypeScript**: Static typing for safer and more maintainable code.
- **Vite**: Build tool and development server for fast HMR.
- **Tailwind v4**: Utility-first CSS framework for styling.
- **GSAP**: For advanced animations.
- **Lucide React**: For consistent, customizable iconography.
- **jsPDF**: For client-side PDF generation (downloading exam questions).

## Backend
- **FastAPI**: A modern, high-performance web framework for building APIs with Python.
- **PyPDF2**: For parsing and extracting text from uploaded PDF documents (`pdf_service.py`).

## AI & Language Models
- **Local Ollama (llama3.1)**: Runs the large language model locally for privacy and offline capability.
- **OpenAI Python Client**: Used to communicate with the local Ollama instance via the OpenAI API format standard (`llm_service.py`).

## Data Storage
- **Memory Dictionary**: **There is no real database.** The application uses an in-memory Python dictionary `MOCK_DB = {}` for state management, which resets upon server restart. Authentication is strictly bypassed with a hardcoded user ID.
