# Study Buddy 🧠

**You teach the AI. It takes the exam.**

Study Buddy is an AI web app built around the **Feynman Technique** — *"if you can't explain it simply, you don't understand it well enough."* Instead of an AI tutoring the student, the student teaches a deliberately "blank" AI learner. If that learner can pass a closed-book exam using only what it was taught, the student has proven they actually understood the material.

---

## The Idea

Most AI study tools put the model in the role of an all-knowing tutor, which encourages passive reading rather than active thinking. Study Buddy flips that around with a **two-agent system**:

| Agent | Role |
|---|---|
| 🧑‍🏫 **Teacher Agent** | Has access to the uploaded study material (the "ground truth"). Generates the exam and grades answers against it. Uses a stronger LLM. |
| 🧒 **Child Agent** | Has **no access** to the source material. It "learns" only from what the student teaches it. Uses a smaller/weaker LLM to minimize pretrained knowledge leaking into the exam. |
| 🧠 **Memory & Learning Engine** | Converts the raw teaching conversation into structured knowledge (concepts, definitions, confidence scores) that becomes the Child Agent's entire knowledge base. |

### How a session works

```
Student uploads material  →  Teacher Agent ingests it as ground truth
        ↓
Student teaches the Child Agent (text, voice) in their own words
        ↓
Memory & Learning Engine extracts structured concepts from the session
        ↓
Teacher Agent generates a closed-book exam from the source material
        ↓
Child Agent answers using ONLY its extracted memory
        ↓
Teacher Agent grades the answers  →  Teaching Efficacy Score (TES)
```

The **Teaching Efficacy Score (TES)** — how well the Child Agent scores on the exam — becomes an automated, measurable stand-in for "did the student really understand this topic," instead of a subjective judgment call.

---

## Project Status & Implementation

**Status: Functional Prototype**

The project has transitioned from the design phase to a fully working application. We have successfully implemented a **local, offline architecture** utilizing **Ollama** and **Llama 3.1 (8B)** to ensure data privacy and run directly on student hardware, with a fallback to Google Gemini. 

**Working Features:**
- 📄 **PDF / Document Upload:** Real-time text extraction and chunking.
- 🎙️ **Voice Teaching Interface:** Students can teach the child agent using their microphone (via Web Speech API).
- 🧠 **Concept Extraction Engine:** Extracts definitions and evaluates student understanding into structured memory.
- 📝 **Automated Exam Generation:** The Teacher Agent creates robust, multi-sentence conceptual questions.
- 📥 **Beautiful PDF Exports:** You can download the generated exam as a formatted, printable PDF.
- 🚀 **Serverless Vercel Deployment:** The frontend and backend are tightly integrated for zero-config Vercel hosting.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, GSAP |
| **Backend** | Python, FastAPI, Vercel Serverless Functions |
| **AI / LLMs** | Local **Ollama (Llama 3.1)** + Fallback to Cloud LLMs (Gemini API) |
| **Document Processing** | PyMuPDF (fitz) |
| **PDF Generation** | jsPDF, jsPDF-AutoTable |
| **Deployment** | Vercel |

## Running Locally

To test the application locally on your machine:

1. **Install and run Ollama** with the Llama 3.1 model:
   ```bash
   ollama run llama3.1
   ```
2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```
3. **Run the Development Server (Frontend + Backend proxy):**
   ```bash
   npm run dev
   ```
4. **Start the FastAPI Backend:**
   Open a second terminal window:
   ```bash
   cd frontend/api
   pip install -r ../requirements.txt
   uvicorn index:app --reload
   ```

## Repository Structure

```
Study-Buddy/
├── frontend/                # Complete implementation code (React UI + Python Backend)
│   ├── src/                 # React frontend code (Pages, Components)
│   └── api/                 # Python FastAPI backend (LLM logic, PDF processing)
├── Docs/                    # Project documentation (Architecture, DFDs, Flows, Walkthroughs)
├── Journal/                 # Weekly progress journals per team member
├── Proposal/                # Full project proposal and deliverables
├── UI Concept/              # Early landing page / interface mockups
└── README.md
```

*Note: The FastAPI backend is housed within the `frontend/api` folder. This is a deliberate architectural choice required for zero-configuration Serverless deployments on Vercel.*

## Team

| Name | Roll No. | Focus areas |
|---|---|---|
| Vansh Arora | 1024030514 | System workflow, UI/UX design, DFD Level 2 |
| Mudit Agarwal | 1024030526 | System architecture, Use Case Diagram, Sequence & Component Diagrams |
| Divyansh Agarwal | 1024030523 | Proposal & research, Gantt chart, prototype & Swimlane Diagram |

Project submitted to **Ms. Nisha Thakur**, Thapar Institute of Engineering and Technology, for course **UCS503P**.
