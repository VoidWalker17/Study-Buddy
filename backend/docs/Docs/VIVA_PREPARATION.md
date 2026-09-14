# VIVA_PREPARATION

This document contains 107 categorized questions to prepare you for any angle the examiner might take.

## Section A: General Project Overview
1. What is the main objective of the Study Buddy project?
2. What is the Feynman Technique and how does your app implement it?
3. What is the technology stack used in this project?
4. Why did you choose a local LLM over a cloud-based one like OpenAI GPT-4?
5. Walk me through the end-to-end data flow of a user session.
6. What makes this project different from standard AI tutors?

## Section B: Frontend (React, Vite, TS)
7. Why did you use Vite instead of Create React App?
8. What are the benefits of using TypeScript over JavaScript in this project?
9. Explain the component lifecycle in React. Which hooks did you use mostly?
10. How does `useState` work in your `StudyTool.tsx`?
11. How do you handle file uploads in React? (FormData)
12. What is Virtual DOM in React?
13. How did you structure your components?

## Section C: Styling (Tailwind v4, GSAP)
14. What is Tailwind CSS and why use it over standard CSS/SCSS?
15. What are utility classes?
16. How does Tailwind v4 differ from older versions?
17. What is GSAP used for in your project?
18. How do you integrate GSAP animations with React components?
19. How did you make the application responsive?
20. Why use Lucide React for icons?

## Section D: Backend (FastAPI, Python)
21. Why did you choose FastAPI over Flask or Django?
22. What is an ASGI server and which one are you using? (Uvicorn)
23. How does FastAPI handle asynchronous requests?
24. Explain Pydantic and how it's used in your project for data validation.
25. How do you define a route in FastAPI?
26. How did you handle CORS (Cross-Origin Resource Sharing) between React and FastAPI?
27. What is Swagger UI and how does FastAPI provide it?

## Section E: LLM & AI Integration (Ollama)
28. What is Ollama?
29. Which specific LLM are you running locally? (llama3.1)
30. How does the backend communicate with Ollama? (OpenAI Python client format)
31. What is Prompt Engineering?
32. How do you ensure the LLM returns JSON instead of plain text?
33. What is the context window of an LLM?
34. How does temperature affect the LLM's output? What temperature did you use?
35. What are the limitations of running models locally?

## Section F: Agent Architecture
36. What is an AI Agent in the context of your project?
37. Are you using an Agent framework like LangChain or AutoGen? (No, custom implementation).
38. Explain the role of the "Teacher Agent".
39. Explain the role of the "Child Agent".
40. How do you isolate the Child Agent from general world knowledge?
41. What is context restriction in prompting?
42. If the user explains something completely wrong, how does the Child Agent react?

## Section G: Data Storage & Database (MOCK_DB)
43. What database are you using? (None, in-memory Python dictionary).
44. Why did you choose an in-memory dictionary for this prototype?
45. Where in the code is the `MOCK_DB` defined? (`ml_routes.py`).
46. What happens to user data when the Uvicorn server restarts? (It is lost).
47. How would you migrate this to a real database like PostgreSQL?
48. What is the structure of the data saved in `MOCK_DB`?
49. How do you identify which data belongs to which user? (Hardcoded user ID).
50. What are the security risks of an in-memory global dictionary?

## Section H: PDF Processing (PyPDF2)
51. How do you extract text from a PDF file?
52. What library are you using? (PyPDF2).
53. How does PyPDF2 read binary files?
54. What happens if the PDF contains images? Can you extract text from them? (No, PyPDF2 does not do OCR).
55. How do you handle large PDFs that exceed the LLM context window? (Currently a limitation; would need RAG).
56. Can your system read encrypted PDFs?
57. Where is the PDF processed—frontend or backend? (Backend).

## Section I: The "Teach" Mechanism
58. What happens when the user submits an explanation?
59. How is the "confidence score" calculated?
60. What endpoint handles the concept extraction? (`/extract-concepts`)
61. What prompt tells the LLM to compare user explanation with ground truth?
62. Where is the resulting knowledge stored?
63. Can a user teach multiple concepts at once?
64. How does the UI reflect the teaching progress?

## Section J: The "Exam" Mechanism
65. When does the exam phase trigger?
66. Who takes the exam? (The Child Agent).
67. What endpoint is called to answer questions? (`/retrieve-memory`)
68. Does the Child Agent see the original PDF? (No).
69. Does the Child Agent see the Teacher's ground truth? (No).
70. How is the memory retrieved from the mock database?
71. What happens if the user skipped teaching a concept entirely? (Child Agent answers "I don't know").

## Section K: The "Grade" Mechanism
72. Who grades the exam? (The Teacher Agent).
73. What inputs does the Teacher Agent need to grade an answer? (Question, Expected Answer, Child's Answer).
74. What is the scale of the grade? (0-100).
75. What endpoint handles grading? (`/grade-answer`).
76. How is the final Efficacy Score calculated? (Average of the 10 grades).
77. Where is the logic for calculating the average executed? (Frontend).
78. What happens if the LLM hallucinating gives a grade of 150? (Strict JSON schema and prompt rules prevent this).

## Section L: TypeScript Specifics
79. What is an Interface in TypeScript? Give an example from your code.
80. How did you define the types for the LLM responses?
81. What is the `any` type and why should it be avoided?
82. How does TypeScript help catch errors during development?
83. Does the browser run TypeScript? (No, Vite transpiles it to JS).
84. How do you type a React Functional Component? (`React.FC`)

## Section M: API & HTTP
85. What HTTP methods are you using? (Mostly POST).
86. Why use POST instead of GET for sending text to the LLM? (Body size limits, security, and modifying state/generating data).
87. What is JSON?
88. What is an API endpoint?
89. How do you pass the PDF file over HTTP? (Multipart form-data).
90. What HTTP status code is returned for a successful request? (200).

## Section N: Error Handling
91. What happens if Ollama is not running on your machine? (Backend throws connection error, frontend shows error state).
92. How do you handle invalid PDFs?
93. What if the LLM returns invalid JSON? (FastAPI/Pydantic throws a validation error).
94. How does the frontend display loading states while waiting for the LLM?

## Section O: Performance
95. Why are LLM responses sometimes slow? (Compute intensive).
96. How could you speed up the LLM responses? (Streaming, smaller quantization models).
97. Does the frontend block while waiting for the backend? (No, uses async/await).
98. What is the bottleneck of this application? (Local GPU/CPU inference speed).

## Section P: Security
99. Is `test-user-123` a secure way to handle sessions? (No).
100. How could someone perform a prompt injection attack on your app?
101. Why is it dangerous to accept and process unvalidated files?
102. How do you protect against Cross-Site Scripting (XSS) in React?

## Section Q: Future Scope
103. How would you scale this for 1,000 users?
104. What is RAG and why does this project need it?
105. How would you integrate voice commands?
106. Could you replace Ollama with a cloud provider? How hard would that be? (Very easy, just change base URL and API key since it uses OpenAI format).
107. How would you add a historical tracking feature for students?

---

# TRICK QUESTIONS (Prepare for these!)

1.  **Examiner:** "I see you used LangChain for your agents. Can you explain your LangChain configuration?"
    *   **Your Answer:** "Actually, sir/ma'am, I deliberately did not use LangChain. I built the agent logic manually using custom prompt engineering in `llm_service.py` to maintain lightweight control and avoid the overhead of a large framework."
2.  **Examiner:** "Show me your database schema in SQL."
    *   **Your Answer:** "For this MVP, I did not use a relational database. To keep the project localized and fast for demonstration, I implemented an in-memory mock database using a Python dictionary in `ml_routes.py`."
3.  **Examiner:** "If the user uploads a 500-page PDF, how fast does your system process it?"
    *   **Your Answer:** "It would actually fail or hallucinate heavily. Currently, we extract all text and pass it directly into the LLM context window. A 500-page PDF exceeds the token limit of Llama 3.1. To fix this, the future scope includes implementing a RAG (Retrieval-Augmented Generation) pipeline."
4.  **Examiner:** "How did you train the Llama model on the student's explanation?"
    *   **Your Answer:** "I did not train or fine-tune the model. I used 'In-Context Learning'. I passed the student's explanation into the prompt as a context variable, isolating the model's instructions so it relies only on that provided context."
5.  **Examiner:** "I noticed your login page is missing."
    *   **Your Answer:** "Yes, user authentication was scoped out for this iteration. We use a hardcoded user ID (`test-user-123`) in the backend to manage the data flow. Adding JWT auth is listed as a primary future enhancement."
6.  **Examiner:** "Does PyPDF2 extract the diagrams from the textbook?"
    *   **Your Answer:** "No, PyPDF2 only extracts raw text. Multimodal extraction (using OCR or Vision models) would be required to analyze diagrams, which is beyond the current scope."
