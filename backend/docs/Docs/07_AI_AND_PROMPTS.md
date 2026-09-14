# AI and Prompts

## Core AI Stack
- **Model**: Local Ollama running `llama3.1`.
- **Integration**: Accessed via the `openai` Python client by pointing the base URL to the local Ollama instance's API format.
- **Central Service**: All LLM interactions are localized in `api/services/llm_service.py`.

## Prompt Engineering & Architecture
The project does not use extensive frameworks like LangChain or AutoGen. The "Agents" (Teacher and Child) are logically separated purely through prompt design.

### Strict JSON Enforcement
A core design constraint of the system is that `llm_service.py` enforces JSON output strictly for almost all LLM interactions. This ensures the FastAPI backend can predictably parse concepts, questions, and grades to send back to the React frontend.

### Logical Agent Prompts
1. **Teacher Prompts**: 
   - Instruct the LLM to act as an authoritative extractor and evaluator.
   - Provided with the full context (extracted PDF text).
   - Responsible for generating the 10 questions and producing the final grading JSON (0-100 score + feedback).
2. **Child Prompts**:
   - Instruct the LLM to act as a student.
   - **Crucial**: The prompt explicitly restricts the LLM from using its pre-trained knowledge. It is fed *only* the contents retrieved from `MOCK_DB` representing what the user taught. This prompt-based restriction is what creates the "Isolation Mechanism."
