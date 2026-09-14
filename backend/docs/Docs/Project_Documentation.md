# Study Buddy AI - Project Documentation

This document explains the codebase, architecture, and step-by-step working of the **Study Buddy AI** project. Read this thoroughly to understand how the system works and how to present it.

## 1. Project Overview

Study Buddy AI is a unique AI-powered learning platform based on the Feynman Technique (learning by teaching). Instead of an AI teaching the student, **the student teaches a "Child Agent" (an AI model with a blank memory)**. 

To prove that the student taught the Child Agent well, a separate **"Teacher Agent"** generates an exam from the original study material, and the Child Agent takes the exam using *only* what the student taught it. The final score reflects the quality of the student's explanation.

---

## 2. System Architecture

The project is built on a modern, offline-first, dual-agent architecture to ensure privacy and avoid API rate limits.

- **Frontend:** React (Vite), Tailwind CSS v4, GSAP (for smooth animations), and Lucide React (for icons). It runs on `localhost:3002`.
- **Backend:** Python FastAPI. It exposes REST API endpoints for the frontend to interact with the AI models. It runs on `localhost:8000`.
- **AI Engine (Offline):** Local **Llama 3.1 (8B)** model running via **Ollama**. We strictly use a local model so we don't have to pay for API keys (like Google Gemini or OpenAI) and the app runs entirely on our own laptop hardware without internet limits.

---

## 3. The Dual-Agent Logic

The core innovation is how we split the AI into two distinct "personas" that interact with each other:

1. **Teacher Model:** Has full access to the uploaded PDF/PPT. Its job is to read the source material, extract concepts, generate a 10-question test paper, and grade the final answers.
2. **Student/Child Model:** Starts with zero knowledge of the PDF. Its memory is strictly populated by the human user's typed/dictated explanations. It answers the Teacher's test *without* ever looking at the PDF.

---

## 4. Step-by-Step Working & Code Flow

Here is exactly what happens when a user uses the application, and which files handle the logic.

### Step 1: Upload Source (PDF Parsing & Test Generation)
- **What happens:** The user uploads a PDF (e.g., `Lecture-Acoustics.pdf`). 
- **Frontend Code:** `frontend/src/pages/StudyTool.tsx` sends the file to the `/api/ml/process-document` endpoint.
- **Backend Code:** 
  - `frontend/api/services/pdf_service.py` uses `PyPDF2` to read all the text from the uploaded PDF.
  - `frontend/api/services/llm_service.py` sends the raw text to the local Llama 3.1 model to extract the core concepts.
  - The model is then prompted to generate **10 hard/medium difficulty long-form questions** based on the PDF. 
  - The generated questions are sent back to the frontend.
- **UI Feature:** The user can click "View Questions" or "Download PDF" to generate a formatted printable test paper using `jspdf` and `jspdf-autotable`.

### Step 2: Knowledge Transfer (Teaching the Child)
- **What happens:** The user uses voice dictation (Web Speech API) or typing to explain the concepts in their own words. They click "Submit Knowledge".
- **Frontend Code:** The human's explanation is sent to `/api/ml/extract-concepts`.
- **Backend Code:** Llama 3.1 evaluates the human's explanation. It generates a strict JSON array containing the concepts the human explained and assigns a "confidence score" based on how accurate the explanation was compared to the original PDF. These concepts are saved into the Child Agent's "Neural Memory".

### Step 3: Neural Evaluation (The Final Exam)
- **What happens:** The user clicks "Start Final Exam". The frontend loops through the 10 questions generated in Step 1.
- **Backend Code:** 
  - First, for every question, the app calls `/api/ml/retrieve-memory`. The **Child Agent** attempts to answer the question using *only* the JSON concepts saved in its memory from Step 2.
  - Second, the app calls `/api/ml/grade-answer`. The **Teacher Agent** compares the Child's answer against the actual expected answer, and assigns a score out of 100 with detailed feedback.
- **Frontend Code:** A beautiful GSAP-animated loading screen shows while the exam is processing. Once finished, it averages the scores and displays the final grade along with the Teacher's feedback for each question.

---

## 5. Summary for Presentation

When you and Mudit present this tomorrow, highlight these three main points:
1. **The Feynman Technique Twist:** We flipped the standard AI tutor model. Teaching an AI forces the student to recall and simplify concepts, which leads to better retention.
2. **100% Offline & Free:** By integrating Ollama and Llama 3.1, the entire app (parsing, teaching, and grading) runs securely on localhost without needing internet or paid APIs.
3. **Multi-Agent System:** The codebase demonstrates advanced AI orchestration—having two separate AI instances (Teacher and Child) interact with each other in the background to simulate a real classroom environment.
