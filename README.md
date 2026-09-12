# Study Buddy 🧠

**You teach the AI. It takes the exam.**

Study Buddy is an AI web app built around the **Feynman Technique** — *"if you can't explain it simply, you don't understand it well enough."* Instead of an AI tutoring the student, the student teaches a deliberately "blank" AI learner. If that learner can pass a closed-book exam using only what it was taught, the student has proven they actually understood the material.

> This repository currently holds the **design and planning phase** of the project (proposal, architecture, diagrams, UI concepts, and team journals) for course **UCS503P** at **Thapar Institute of Engineering and Technology**. Implementation has not started yet — see [Project Status](#project-status) below.

---

## The Idea

Most AI study tools put the model in the role of an all-knowing tutor, which encourages passive reading rather than active thinking. Study Buddy flips that around with a **two-agent system**:

| Agent | Role |
|---|---|
| 🧑‍🏫 **Teacher Agent** | Has access to the uploaded study material (the "ground truth"). Generates the exam and grades answers against it. Uses a stronger LLM. |
| 🧒 **Child Agent** | Has **no access** to the source material. It "learns" only from what the student teaches it. Uses a smaller/weaker LLM to minimize pretrained knowledge leaking into the exam. |
| 🧠 **Memory & Learning Engine** | Converts the raw teaching conversation into structured knowledge (concepts, definitions, confidence scores) that becomes the Child Agent's entire knowledge base — the original chat log is then discarded. |

### How a session works

```
Student uploads material  →  Teacher Agent ingests it as ground truth
        ↓
Child Agent takes a "cold baseline" exam (before any teaching)
        ↓
Student teaches the Child Agent (text, voice later) in their own words
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

### Why the cold baseline matters

Before any teaching happens, the Child Agent takes the same exam "cold." Comparing that baseline score to its post-teaching score is how the project checks for **knowledge leakage** — i.e. making sure a good score reflects what the student actually taught, not knowledge the model already had.

---

## Project Status

This repo is currently a **software engineering course deliverable**, not a runnable application. It contains the problem definition, proposal, architecture/diagrams, UI concept, and weekly team journals produced while designing the system. No frontend, backend, or agent code has been committed yet.

**Planned initial deliverable:**
- Document upload + Teacher Agent ingestion pipeline
- Text-based teaching interface for the Child Agent
- First-pass memory extraction (transcript → structured JSON)
- Basic exam generation and automated grading

**Planned subsequent deliverables:**
- Voice-based teaching via Whisper
- Analytics dashboard (TES over time, via Chart.js)
- Confidence-based follow-up questions from the Child Agent

## Planned Tech Stack

The stack below is what's proposed in [`Proposal/proposal.tex`](Proposal/proposal.tex) — nothing here is implemented yet.

| Layer | Planned Technology |
|---|---|
| Frontend | React.js / Next.js |
| Backend | Python, FastAPI |
| AI / LLMs | Pretrained LLMs (Llama 3.1 / GPT-class); stronger model for Teacher Agent, smaller/weaker model for Child Agent |
| Application data | PostgreSQL |
| Child Agent memory / retrieval | FAISS / ChromaDB |
| Document processing | PyPDF |
| Voice (future) | Whisper API |
| Analytics | Chart.js |
| Deployment (planned) | Dockerized services on AWS / Render |

## Evaluation Metrics (proposed)

- **Teaching Efficacy Score (TES)** — primary metric; the Child Agent's graded exam score.
- **Memory extraction accuracy** — % of concepts from a canonical reference list correctly captured in the Child Agent's structured memory.
- **Cold baseline score** — Child Agent's exam score *before* teaching, used to estimate knowledge leakage.
- **System latency** — measured per stage (transcription, extraction, retrieval, generation); sub-2-second end-to-end response is an aspirational target.

## Repository Structure

```
Study-Buddy/
├── Proposal/
│   ├── proposal.tex              # Full project proposal (goals, architecture, risks, scope)
│   └── studybuddyproposal (2).pdf
├── Docs/
│   ├── System Architecture.pdf
│   ├── SE PROJECT FLOW.pdf
│   ├── Use Case Diagram.pdf
│   ├── Study_Buddy_All_Use_Case_Templates.drawio.pdf
│   ├── Study_Buddy_Activity_Diagram_Final.drawio.png
│   ├── Gantt_Chart_Monthly.pdf
│   ├── UCS503 Software Bid.docx
│   └── Data Flow Diagrams/        # DFD Level 0, 1, 2
├── UI Concept/                    # Early landing page / interface mockups
└── Journal/                       # Weekly progress journals per team member
    ├── Divyansh 1024030523/
    ├── Mudit 1024030526/
    └── vansh 1024030514/
```

## Team

| Name | Roll No. | Focus areas (from journals) |
|---|---|---|
| Vansh Arora | 1024030514 | System workflow, UI/UX design, DFD Level 2 |
| Mudit Agarwal | 1024030526 | System architecture, Use Case Diagram, Sequence & Component Diagrams |
| Divyansh Agarwal | 1024030523 | Proposal & research, Gantt chart, prototype & Swimlane Diagram |

Project submitted to **Ms. Nisha Thakur**, Thapar Institute of Engineering and Technology, for course **UCS503P**.

## Diagrams & Documentation

The `Docs/` folder contains the full design trail behind the proposal:
- **Data Flow Diagrams** (Levels 0–2) tracing how information moves from upload → teaching → memory → exam → dashboard
- **Activity Diagram** showing the swimlane of Student / Teacher Agent / Child Agent / Memory Engine across a full session
- **Use Case Diagram** and **System Architecture** for the planned components
- **Gantt Chart** for project timeline and task sequencing

The `UI Concept/` folder contains early visual direction for the landing page and app interface.

## License

No license file is currently present in this repository.
