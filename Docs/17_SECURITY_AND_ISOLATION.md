# Security and Agent Isolation

A critical component of the Study Buddy system is how it maintains the illusion of separate "Agents" and ensures data privacy.

## 1. Agent Isolation Mechanism

The system relies on two conceptual agents: the **Teacher Agent** and the **Child Agent**. 
*Important Viva Note:* There is no complex multi-agent framework (like AutoGen or LangChain) running under the hood. Isolation is achieved entirely through **Prompt Context Restriction**.

**How the Child Agent is Isolated:**
1.  **Memory Storage:** When the student teaches a concept, the extracted knowledge is stored in a Python dictionary (`MOCK_DB`) mapped to the user.
2.  **Restricted Context:** During the exam phase, when the Child Agent must answer a question, the backend retrieves *only* the specific knowledge from `MOCK_DB`. 
3.  **Strict Prompting:** The LLM prompt explicitly states: *"Answer this question using ONLY the provided memory context. If the answer is not in the context, state that you do not know."*
4.  **Result:** The LLM (acting as the Child) is isolated from its vast pre-trained knowledge base and the original PDF content. It can only "know" what it was explicitly taught by the user.

## 2. System Security and Privacy

**Data Privacy (Local AI):**
*   Because the project uses a **Local Ollama (llama3.1)** instance, no user data or PDF content is ever sent to third-party servers (like OpenAI or Anthropic). 
*   This ensures complete data privacy for study materials, which is a strong selling point for a personal study tool.

**Authentication (Current State):**
*   **Limitation:** There is currently NO real user authentication system (e.g., JWT, OAuth).
*   **Implementation:** The system uses a hardcoded user identifier (`"test-user-123"`) to map data in the `MOCK_DB`. 
*   If this were to go to production, a proper auth layer (like Clerk or NextAuth) would need to be implemented to securely partition memory between different students.

**Input Validation:**
*   FastAPI and Pydantic handle basic security against malformed requests by strictly validating incoming JSON payloads against expected schemas.
