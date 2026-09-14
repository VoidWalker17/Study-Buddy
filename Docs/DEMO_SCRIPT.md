# DEMO_SCRIPT

Follow these steps exactly during your viva presentation to show a flawless, working project.

## PRE-DEMO CHECKLIST (Do this before the examiner looks at your screen)
1.  Make sure Docker/Ollama is running. Run `ollama run llama3.1` in a terminal to ensure the model is loaded in memory (prevents slow first-request times).
2.  Start the backend: `cd backend` -> `uvicorn main:app --reload`. Check that `http://localhost:8000/docs` works.
3.  Start the frontend: `cd frontend` -> `npm run dev`.
4.  Have a **small, simple PDF** ready on your desktop (e.g., a 2-page PDF about Photosynthesis or basic Newton's Laws). Do NOT use a 50-page textbook, it will take too long or crash.

---

## 1. Introduction (The Hook)
*   **Action:** Show the landing page.
*   **Script:** "Good morning/afternoon. This is Study Buddy, an AI application built to help students learn via the Feynman Technique. Instead of reading to learn, the student learns by teaching the AI. If the AI can pass a test based on the student's explanation, the student has mastered the topic."

## 2. Step 1: Upload (The Source Material)
*   **Action:** Click the Upload button and select your sample PDF.
*   **Script:** "Here, I'm uploading a short document on [Topic]. The FastAPI backend uses PyPDF2 to extract the text. It then asks our local Llama 3.1 model to extract the ground truth concepts and generate 10 exam questions."
*   **Action:** Wait for the UI to transition to the "Teach" phase. Point out the Download PDF button if they ask about offline questions.

## 3. Step 2: Teach (The Core Interaction)
*   **Action:** Look at the concepts on the screen. Type a *good* explanation for the first concept.
*   **Script:** "Now I must teach the AI. I will explain the first concept. The backend compares my explanation to the ground truth and assigns a confidence score. This knowledge is saved into the AI's isolated memory."
*   **Action:** Submit the explanation.
*   **Action:** Now, deliberately type a *bad or factually incorrect* explanation for the second concept.
*   **Script:** "For the second concept, I will give a poor explanation. Notice how the system captures this exactly as I teach it."

## 4. Step 3: Evaluate (The Agents in Action)
*   **Action:** Click "Evaluate". The screen will show the Child Agent answering questions and the Teacher Agent grading them.
*   **Script:** "This is the most critical part. We use an isolated Agent Architecture. The Child Agent attempts to answer the generated questions using *only* the specific knowledge I just taught it. It does not use its pre-trained internet knowledge. Then, the Teacher Agent grades the Child's answers against the ground truth."
*   **Action:** Highlight a specific grade on the screen.
*   **Script:** "Notice here: for the concept I explained well, the child got it right and scored highly. For the concept I explained poorly, the child failed, resulting in a low score. The overall Efficacy Score is the average."

## 5. Conclusion
*   **Script:** "By forcing the student to articulate the concepts, and visually showing them where their teaching (and thus their understanding) failed, Study Buddy provides an interactive and highly effective revision tool. Thank you."
