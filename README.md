# Study Buddy 🧠

**You teach the AI. It takes the exam.**

🌐 **Live Web App:** [https://studybuddy-feynman.vercel.app](https://studybuddy-feynman.vercel.app)

[![Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-0f3238?style=for-the-badge&logo=vercel)](https://studybuddy-feynman.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20FastAPI%20%7C%20Groq%20Cloud-c2983b?style=for-the-badge)](https://studybuddy-feynman.vercel.app)

Study Buddy is an AI-powered learning platform built around the **Feynman Technique** — *"If you can't explain it simply, you don't understand it well enough."* 

Instead of an AI tutoring the student through passive regurgitation, Study Buddy reverses the dynamic: the student teaches a deliberately naive **Child AI**. If that learner can pass a blind, closed-book exam prepared by a strict **Teacher Agent** using *only* what the student explained, the student has proven true conceptual mastery.

---

## 💡 The Core Architecture: Dual-Agent Socratic Engine

Traditional study tools use a single all-knowing tutor, encouraging passive reading rather than active synthesis. Study Buddy introduces an adversarial **two-agent verification system**:

| Agent | Architecture | Role & Responsibility |
|---|---|---|
| 🧑‍🏫 **Teacher Agent** | `openai/gpt-oss-120b` (Groq Cloud) | Ingests the uploaded course material as **Ground Truth**. Extracts foundational concepts, generates a rigorous 10-question closed-book exam, and performs objective blind evaluation. |
| 🧒 **Child Agent** | `openai/gpt-oss-20b` (Groq Cloud) | Starts with **zero access** to the source document. It learns strictly through what the student teaches via voice or text. Evaluated on a cold baseline prior to teaching. |
| 🧠 **Memory & Concept Graph** | Socratic Vector Extraction | Parses explanations into structured concept-definition DAG nodes with dependency mapping and confidence scoring. |
| 🎙️ **Voice Engine** | Groq Whisper Large v3 Turbo | Transcribes spoken teaching explanations in real-time with browser Web Speech API fallback. |

---

## 🔄 The 4-Step Feynman Protocol

```
Step 1: Upload Material      → Teacher Agent analyzes PDF and extracts ground-truth concepts
          ↓
Step 2: Cold Baseline Exam   → Child Agent takes the exam with ZERO document access (Scores 8–20%)
          ↓
Step 3: Active Socratic Chat → Student explains concepts in plain English (Text / Voice Input)
          ↓
Step 4: Blind Final Exam     → Child Agent re-takes the exam using ONLY taught memory
          ↓
   Teaching Efficiency Score (TES) = (Final Score - Baseline Score) × Concept Coverage
```

### The Teaching Efficiency Score (TES)
The **Teaching Efficiency Score (TES)** provides an empirical, objective metric of student mastery:
- **Baseline Score**: What the naive model knew prior to student instruction.
- **Final Blind Exam Score**: What the child model was able to answer using *only* concepts taught by the student.
- **Verified Retention Delta**: Quantitative measurement of conceptual transfer.

---

## 🛠️ Complete Tech Stack

| Layer | Technologies | Details |
|---|---|---|
| **Frontend Framework** | **React 19**, **TypeScript**, **Vite** | Lightning-fast HMR, component isolation, React context architecture |
| **Styling & Design System** | **Tailwind CSS v4**, **GSAP**, **Framer Motion**, **Lenis** | Editorial typography, responsive bento grids, hardware-accelerated smooth scrolling, dark/light mode |
| **Icons & Typography** | **Lucide React**, Serif/Mono typography | High-contrast academic aesthetic with custom brand assets |
| **Backend API** | **Python 3.13**, **FastAPI**, **Uvicorn** | High-performance asynchronous REST API with automatic OpenAPI documentation |
| **Primary Cloud Inference** | **Groq Cloud API** | Ultra-low latency LPU inference: Teacher (`gpt-oss-120b`), Child (`gpt-oss-20b`), Speech (`whisper-large-v3-turbo`) |
| **Local Offline Fallback** | **Ollama** | Fully offline privacy mode running `llama3.1` (8B) |
| **Document Ingestion** | **PyPDF2**, **PyMuPDF** | Multipart chunking, text normalization, and conceptual hierarchy extraction |
| **Database & Persistence** | **SQLite (WAL Mode)** + **PostgreSQL** compatibility | Full session history, concepts graph, and blind exam question analytics |
| **Authentication** | **Stateless Cryptographic Tokens (HMAC-SHA256)** | Serverless-native token verification resilient across ephemeral cloud instances |
| **PDF Reporting** | **jsPDF**, **jsPDF-AutoTable** | Comprehensive printable academic mastery reports and certificates |
| **Deployment & Hosting** | **Vercel Serverless Functions** | Unified zero-configuration fullstack deployment with production alias routing |

---

## 📸 Application Preview & Screenshots

The repository includes high-resolution UI captures showcasing the end-to-end user journey in `screenshots/`:

| # | Screen | Description |
|---|---|---|
| **01** | `01_landing_hero.png` | Editorial landing page with Feynman principle and studio entry |
| **02** | `02_landing_features.png` | Dual-agent architecture breakdown and Socratic mechanics |
| **03** | `03_landing_workflow.png` | Complete 4-step Feynman learning pipeline |
| **04** | `04_auth_modal.png` | Authentication and account management interface |
| **05** | `05_dashboard_overview.png` | Student dashboard with TES KPIs, study streak, and audited records |
| **06** | `06_session_history.png` | Comprehensive session history with baseline vs final exam deltas |
| **07** | `07_teaching_chamber_step1_setup.png` | Step 1: Course material PDF setup and domain categorization |
| **08** | `08_teaching_chamber_step2_baseline.png` | Step 2: Cold baseline exam establishing zero-knowledge benchmark |
| **09** | `09_teaching_chamber_step3_socratic.png` | Step 3: Live Socratic dialogue and real-time voice explanation |
| **10** | `10_teaching_chamber_step4_tes_report.png` | Step 4: Blind final examination results and TES mastery grade |
| **11** | `11_dashboard_dark_mode.png` | High-contrast dark mode aesthetic across the workspace |

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+
- *(Optional)* **Groq API Key** for cloud inference, or **Ollama** for offline local inference.

### 1. Clone the Repository
```bash
git clone https://github.com/agarwaldivyansh/Study-Buddy.git
cd Study-Buddy
```

### 2. Configure Environment Variables
Create `frontend/api/.env`:
```env
# Cloud Groq Inference (Recommended)
GROQ_API_KEY=your_groq_api_key_here
TEACHER_MODEL=openai/gpt-oss-120b
CHILD_MODEL=openai/gpt-oss-20b

# Optional Local Ollama Mode
# LLM_BASE_URL=http://localhost:11434/v1
# LLM_API_KEY=ollama
```

### 3. Backend Setup
```bash
cd frontend/api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Frontend Setup
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:3002`.

---

## 📂 Repository Structure

```
Study-Buddy/
├── frontend/                # Complete unified fullstack code
│   ├── src/                 # React 19 Frontend (Pages, Components, Contexts)
│   │   ├── components/      # UI components (Header, ThemeToggle, Auth cards)
│   │   ├── context/         # AuthContext (HMAC token auth), ThemeContext
│   │   ├── pages/           # LandingPage, DashboardPage, StudyTool (Teaching Chamber)
│   │   └── index.html       # Single Page Application root
│   ├── api/                 # FastAPI Backend & LLM Services
│   │   ├── routers/         # ML routes, session routes, auth routes
│   │   ├── services/        # llm_service.py, pdf_service.py
│   │   ├── database.py      # SQLite / Postgres unified interface & crypto tokens
│   │   ├── studybuddy.db    # Baseline database schema
│   │   └── index.py         # FastAPI application entrypoint for Vercel Serverless
│   ├── public/              # Brand assets, logos, and favicons
│   ├── scripts/             # Automated test and screenshot generators
│   ├── vercel.json          # Zero-config Vercel Serverless routing
│   └── vite.config.ts       # Vite proxy & Tailwind v4 configuration
├── screenshots/             # High-resolution screenshots of the working platform
├── Docs/                    # Architecture diagrams, DFDs, and system walkthroughs
├── Journal/                 # Weekly engineering progress journals
├── Proposal/                # Project specification and academic deliverables
├── UI Concept/              # Initial interface design concepts
└── README.md                # Project documentation
```

*Architectural Note: The FastAPI backend is located inside `frontend/api` to enable single-repo, zero-latency serverless routing on Vercel without requiring separate microservice deployments.*

---

## 👥 Engineering Team

| Name | Roll No. | Core Contributions |
|---|---|---|
| **Vansh Arora** | 1024030514 | System workflow, UI/UX design, DFD Level 2 |
| **Mudit Agarwal** | 1024030526 | System architecture, Use Case Diagram, Sequence & Component Diagrams |
| **Divyansh Agarwal** | 1024030523 | Fullstack implementation, Socratic engine, Groq inference, Vercel deployment, Swimlane Diagrams |

Project submitted to **Ms. Nisha Thakur**, Thapar Institute of Engineering and Technology, for course **UCS503P**.
