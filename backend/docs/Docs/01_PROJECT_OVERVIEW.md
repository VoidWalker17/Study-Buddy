# Study Buddy - Project Overview

## 1. Introduction
Study Buddy is an AI-powered educational application designed to reinforce learning through the Feynman Technique. Users upload educational materials, teach the extracted concepts to an AI "Child Agent", and are subsequently evaluated by an AI "Teacher Agent" to measure their understanding.

## 2. Tech Stack
The project is built with a modern, lightweight tech stack:
*   **Frontend**: React, TypeScript, Vite, Tailwind v4, GSAP (for animations), Lucide React (icons), jsPDF (for generating PDFs of questions).
*   **Backend**: FastAPI (Python) serving REST API endpoints.
*   **AI / LLM**: Local Ollama running the `llama3.1` model, interfaced via the standard OpenAI API format.
*   **Database**: **None**. There is no real database used in this project. All memory and state are maintained via an in-memory Python dictionary (`MOCK_DB`).
*   **Authentication**: None. The system uses a hardcoded user ID (`test-user-123`).

## 3. Core Architecture
The system employs a dual-agent conceptual model, though fundamentally both agents are powered by the same underlying LLM utilizing different system prompts.

*   **Teacher Agent**: Extracts ground truth concepts from uploaded PDFs, generates exam questions, and grades the Child Agent's answers against the expected answers.
*   **Child Agent**: Simulates a student learning from the user. It answers exam questions **strictly** using the knowledge (concepts) taught by the user and stored in its memory.

There are no complex agent frameworks (like LangChain or AutoGen) involved. The agents are simply distinct prompt templates enforced strictly in the backend service layer.

## 4. Limitations & Truths
*   **Persistence**: Because the application uses an in-memory `MOCK_DB` (`{}` inside `ml_routes.py`), all data (documents, taught concepts, agent memory) is lost whenever the FastAPI server restarts.
*   **Scalability**: The lack of a real database and the use of a hardcoded user ID means the application is currently a single-user prototype.
