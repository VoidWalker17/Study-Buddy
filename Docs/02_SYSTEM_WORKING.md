# Study Buddy - System Working

The Study Buddy system operates in a linear 4-step workflow, guiding the user from content upload to final evaluation. 

## Step 1: Upload (Knowledge Extraction)
1.  The user uploads a PDF document via the frontend.
2.  The backend (`/process-document`) reads the PDF using `PyPDF2`.
3.  The Teacher Agent (via `llm_service.py`) analyzes the text, extracts the core **Ground Truth Concepts**, and generates a set of 10 final exam questions based on these concepts.

## Step 2: Teach (Knowledge Transfer)
1.  The user selects extracted concepts and explains them to the "Child Agent" using text or voice input.
2.  The backend (`/extract-concepts`) processes the user's explanation.
3.  The LLM evaluates the explanation against the Ground Truth Concepts, assigning a confidence score.
4.  This structured knowledge (the user's explanation) is saved into the `MOCK_DB` under the user's ID. This constitutes the **Child Agent's Memory**.

## Step 3: Exam (Knowledge Testing)
1.  During the evaluation phase, the frontend (`StudyTool.tsx`) iterates through the 10 generated exam questions.
2.  For each question, it calls `/retrieve-memory`.
3.  The Child Agent is prompted to answer the question. **Crucially, an Isolation Mechanism is applied**: the Child Agent's prompt restricts it to answering *only* using the text stored in `MOCK_DB` (the concepts taught by the user). If the user taught the concept poorly, the Child Agent will answer poorly.

## Step 4: Grade (Evaluation)
1.  After the Child Agent answers, the frontend calls `/grade-answer`.
2.  The Teacher Agent compares the Child Agent's answer against the Expected Answer (generated in Step 1).
3.  The Teacher Agent assigns a score from 0-100 and provides specific feedback on what was missing or misunderstood.
4.  The final **Efficacy Score** displayed to the user is the average of these 10 grades.
