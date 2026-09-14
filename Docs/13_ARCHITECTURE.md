# System Architecture

The architecture of Study Buddy is designed around a direct data flow between the user (student), a Teacher Agent, and a Child Agent. 

> [!NOTE]
> **Agent Implementation Detail:** There are no complex agent frameworks (like LangChain or AutoGen) involved. "Teacher Agent" and "Child Agent" are purely logical concepts implemented via different prompt templates in `llm_service.py` hitting the same local LLM.

## Data Flow

### 1. Upload & Process
1. **User Action**: Student uploads a study material PDF.
2. **Processing**: `ml_routes.py:/process-document` calls `pdf_service.py` to extract text.
3. **LLM Task (Teacher)**: `llm_service.py` extracts Ground Truth concepts from the text and generates 10 final exam questions with expected answers.

### 2. Teach & Extract
1. **User Action**: Student explains the concepts to the "Child Agent".
2. **Processing**: `ml_routes.py:/extract-concepts` passes the explanation to the LLM.
3. **LLM Task (Teacher)**: The LLM compares the student's explanation to the Ground Truth concepts, assigns a confidence score, and structures the knowledge.
4. **Storage**: This verified, structured knowledge is saved into `MOCK_DB` as the Child Agent's Memory.

### 3. Exam (Isolation Mechanism)
1. **User Action**: Student starts the exam phase.
2. **Processing**: The frontend iterates through the generated questions and calls `ml_routes.py:/retrieve-memory`.
3. **LLM Task (Child)**: The LLM acts as the Child Agent. **Crucially, it is isolated via prompt context restriction.** It must answer the question using *ONLY* the text stored in `MOCK_DB`. This isolation proves what the student successfully taught.

### 4. Grade & Feedback
1. **Processing**: The frontend calls `ml_routes.py:/grade-answer`.
2. **LLM Task (Teacher)**: The LLM evaluates the Child's answer against the expected answer, providing a score from 0-100 and specific feedback.
3. **Result**: The final **Efficacy Score** is simply the average of these 10 grades, indicating how well the student understands the material.
