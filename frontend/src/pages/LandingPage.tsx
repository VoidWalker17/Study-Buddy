import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Heart,
  Layers,
  Mic,
  Minus,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  TrendingUp,
  X,
  Menu
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export type SubjectShot = {
  src: string
  alt?: string
  tone?: string
  focus?: string
}

export type SubjectCard = {
  id: string
  name: string
  domain: string
  image: SubjectShot
  time: number
  conceptsCount: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tags: string[]
  brief: string
}

export type ScholarTestimonial = {
  quote: string
  name: string
  role: string
  image?: SubjectShot
}

export type DrillStep = {
  title: string
  text: string
  minutes?: number
}

export type DrillExercise = {
  name: string
  topic: string
  image: SubjectShot
  time: number
  targetConcepts: number
  steps: DrillStep[]
  laymanExplanation: string
  rigorousExplanation: string
}

export type DomainCategory = {
  name: string
  count: number
  image: SubjectShot
}

export type ResearchArticle = {
  id: string
  title: string
  kind: "Knowledge" | "Blog" | "Podcasts"
  date: string
  read: string
  image: SubjectShot
  brief: string
}

export interface LandingPageProps {
  onStart: () => void
  onOpenAuth: (mode?: "login" | "register") => void
  onGoToDashboard: () => void
}

// ---------------- Content Data ----------------

const U = "https://images.unsplash.com/photo-"
const shot = (id: string, alt: string, tone: string, focus?: string): SubjectShot => ({
  src: U + id,
  alt,
  tone,
  focus
})

const DEFAULT_SUBJECTS: SubjectCard[] = [
  {
    id: "quantum-electrodynamics",
    name: "Quantum Mechanics & Wave Packets",
    domain: "Physics",
    image: shot("1635070041078-e363dbe005cb", "Quantum wave packet interference lasers", "#1e1b4b"),
    time: 25,
    conceptsCount: 8,
    difficulty: "Advanced",
    tags: ["physics", "stem", "advanced"],
    brief: "De Broglie wavelengths, Heisenberg uncertainty, and wavefunction collapse."
  },
  {
    id: "neural-attention",
    name: "Transformer Attention & Neural Nets",
    domain: "Computer Science",
    image: shot("1620712943543-bcc4688e7485", "Glowing neural network architecture", "#0f172a"),
    time: 20,
    conceptsCount: 10,
    difficulty: "Advanced",
    tags: ["cs", "stem", "advanced"],
    brief: "Scaled dot-product attention, multi-head projections, and backpropagation."
  },
  {
    id: "molecular-genetics",
    name: "Cellular Respiration & Krebs Cycle",
    domain: "Biomedical",
    image: shot("1530497610245-94d3c16cda28", "DNA double helix microscope optics", "#14532d"),
    time: 30,
    conceptsCount: 9,
    difficulty: "Intermediate",
    tags: ["biomedical", "stem"],
    brief: "Oxidative phosphorylation, ATP synthase motors, and electron transport."
  },
  {
    id: "macroeconomics",
    name: "Macroeconomics & Game Theory",
    domain: "Economics",
    image: shot("1611974789855-9c2a0a7236a3", "Global economic trading and financial data", "#78350f"),
    time: 22,
    conceptsCount: 7,
    difficulty: "Intermediate",
    tags: ["economics"],
    brief: "Nash equilibrium, monetary policy transmission, and inflation curves."
  },
  {
    id: "os-virtual-memory",
    name: "Operating Systems & Virtual Memory",
    domain: "Computer Science",
    image: shot("1518770660439-4636190af475", "Silicon microprocessor wafer circuit board", "#1e293b"),
    time: 28,
    conceptsCount: 8,
    difficulty: "Intermediate",
    tags: ["cs", "stem"],
    brief: "Page tables, TLB cache misses, segmentation, and demand paging."
  },
  {
    id: "neurobiology",
    name: "Neurobiology & Synaptic Transmission",
    domain: "Biomedical",
    image: shot("1559757175-5700dde675bc", "Neural brain synaptic network illumination", "#312e81"),
    time: 24,
    conceptsCount: 6,
    difficulty: "Advanced",
    tags: ["biomedical", "stem"],
    brief: "Action potential kinetics, neurotransmitter exocytosis, and long-term potentiation."
  },
  {
    id: "pure-math",
    name: "Abstract Algebra & Group Theory",
    domain: "Mathematics",
    image: shot("1509228468518-180dd4864904", "Mathematics equations on classroom chalkboard", "#1f2937"),
    time: 35,
    conceptsCount: 11,
    difficulty: "Advanced",
    tags: ["mathematics", "stem", "advanced"],
    brief: "Homomorphisms, Lagrange's theorem, cyclic groups, and symmetry operations."
  },
  {
    id: "organic-chemistry",
    name: "Organic Chemistry Stereochemistry",
    domain: "Chemistry",
    image: shot("1532187863486-abf9dbad1b69", "Laboratory glassware with glowing chemical reaction", "#064e3b"),
    time: 30,
    conceptsCount: 8,
    difficulty: "Intermediate",
    tags: ["stem"],
    brief: "Chirality, enantiomers, nucleophilic substitution (SN1/SN2), and carbocations."
  },
  {
    id: "distributed-systems",
    name: "Distributed Consensus & Raft",
    domain: "Computer Science",
    image: shot("1451187580459-43490279c0fa", "Global network constellation mesh", "#0369a1"),
    time: 26,
    conceptsCount: 7,
    difficulty: "Advanced",
    tags: ["cs", "stem"],
    brief: "Leader election, log replication, safety invariants, and Byzantine fault tolerance."
  },
  {
    id: "astrophysics",
    name: "Astrophysics & General Relativity",
    domain: "Physics",
    image: shot("1462331940025-496dfbfc7564", "Deep celestial nebula and starry cosmos", "#2e1065"),
    time: 40,
    conceptsCount: 9,
    difficulty: "Advanced",
    tags: ["physics", "stem"],
    brief: "Spacetime curvature, geodesic trajectories, Schwarzschild radius, and Hawking radiation."
  },
  {
    id: "cognitive-science",
    name: "Cognitive Science & Mental Models",
    domain: "Cognitive Science",
    image: shot("1507679799987-c73779587ccf", "Architectural clean study table with books and laptop", "#44403c"),
    time: 18,
    conceptsCount: 6,
    difficulty: "Beginner",
    tags: ["cognitive"],
    brief: "Working memory bounds, spaced retrieval, chunking, and dual-coding theory."
  },
  {
    id: "particle-physics",
    name: "Particle Physics & Standard Model",
    domain: "Physics",
    image: shot("1507413245164-6160d8298b31", "Particle physics optics and laboratory laser beam", "#1e1b4b"),
    time: 32,
    conceptsCount: 10,
    difficulty: "Advanced",
    tags: ["physics", "stem"],
    brief: "Quarks, leptons, gauge bosons, Higgs mechanism, and electroweak symmetry."
  }
]

const DEFAULT_TESTIMONIALS: ScholarTestimonial[] = [
  {
    quote: "Study Buddy forced me to stop skimming. When the Child Agent asked why backprop requires the chain rule instead of finite differences, I froze. Forcing myself to teach it simply pushed me into the top 1% of my graduate AI qualifiers.",
    name: "Alex Chen",
    role: "Stanford AI Researcher",
    image: shot("1534528741775-53994a69daeb", "Portrait of Alex Chen", "#334155")
  },
  {
    quote: "My undergraduate physics students who taught the Child Agent scored 28% higher on conceptual synthesis exams. It completely breaks the illusion of competence. It's the only AI tool that enforces active recall over passive reading.",
    name: "Dr. Elena Vance",
    role: "Professor of Theoretical Physics, Oxford",
    image: shot("1573496359142-b8d87734a5a2", "Portrait of Dr. Elena Vance", "#1e293b")
  },
  {
    quote: "Teaching the Child Agent feels like mentoring a curious medical intern. When you can explain renal electrolyte regulation in plain English without notes, you truly know it. Cut my USMLE Step 1 study time in half.",
    name: "Marcus Thornton",
    role: "Johns Hopkins Medical Scholar",
    image: shot("1507003211169-0a1dd7228f2d", "Portrait of Marcus Thornton", "#0f172a")
  }
]

const DEFAULT_DRILL: DrillExercise = {
  name: "Wave-Particle Duality & De Broglie Hypothesis",
  topic: "Quantum Foundations",
  image: shot("1635070041078-e363dbe005cb", "Quantum interference lasers", "#1e1b4b"),
  time: 15,
  targetConcepts: 4,
  steps: [
    {
      title: "Deconstruct Postulate",
      text: "Explain Louis de Broglie's hypothesis (λ = h/p) in plain English without citing formulas or invoking magic.",
      minutes: 3
    },
    {
      title: "Layman Analogy",
      text: "Formulate an everyday physical analogy comparing macroscopic baseballs to microscopic electrons.",
      minutes: 5
    },
    {
      title: "Resolve Paradox",
      text: "Answer the Child Agent's challenge: 'If baseballs have wavelengths, why don't they diffract through a doorway?'",
      minutes: 4
    },
    {
      title: "120B Verification",
      text: "The Teacher Agent verifies your clarity, penalizes buzzwords, and tests the Child Agent's retained memory."
    }
  ],
  laymanExplanation: "Light acts like ripples on a lake when traveling, but like tiny localized pebbles when striking a wall. Similarly, particles of matter have a microscopic ripple that scales inversely with their mass.",
  rigorousExplanation: "Every quantum entity is characterized by a state vector whose spatial probability amplitude exhibits wave interferometry with wavelength λ = h/mv, verifiable through Davisson-Germer electron diffraction."
}

const DEFAULT_CATEGORIES: DomainCategory[] = [
  { name: "Theoretical Physics", count: 142, image: shot("1635070041078-e363dbe005cb", "", "#1e1b4b") },
  { name: "Artificial Intelligence", count: 215, image: shot("1620712943543-bcc4688e7485", "", "#0f172a") },
  { name: "Computer Systems", count: 178, image: shot("1518770660439-4636190af475", "", "#1e293b") },
  { name: "Biomedical Sciences", count: 310, image: shot("1530497610245-94d3c16cda28", "", "#14532d") },
  { name: "Pure Mathematics", count: 190, image: shot("1509228468518-180dd4864904", "", "#1f2937") },
  { name: "Economics & Finance", count: 124, image: shot("1611974789855-9c2a0a7236a3", "", "#78350f") },
  { name: "Neuroscience", count: 165, image: shot("1559757175-5700dde675bc", "", "#312e81") },
  { name: "Organic Chemistry", count: 230, image: shot("1532187863486-abf9dbad1b69", "", "#064e3b") },
  { name: "Philosophy & Logic", count: 98, image: shot("1456513080510-7bf3a84b82f8", "", "#451a03") }
]

const DEFAULT_ARTICLES: ResearchArticle[] = [
  {
    id: "r1",
    title: "The Feynman Technique in the Era of Large Language Models: A Cognitive Transfer Study",
    kind: "Knowledge",
    date: "2026-03-12",
    read: "8 min read",
    image: shot("1434030216411-0b793f4b4173", "Student taking structured notes", "#1e293b"),
    brief: "Empirical trial demonstrating 3.4x higher conceptual recall when students teach isolated agents."
  },
  {
    id: "r2",
    title: "Cognitive Isolation: Eliminating AI Hallucination by Partitioning Teacher and Student LLMs",
    kind: "Knowledge",
    date: "2026-04-05",
    read: "11 min read",
    image: shot("1457369804613-52c61a468e7d", "Open book in university library", "#0f172a"),
    brief: "Why zero document leakage to the learner agent is required to evaluate true human understanding."
  },
  {
    id: "r3",
    title: "The Mathematics of TES: Formalizing the Teaching Effectiveness Score (ΔScore × Coverage)",
    kind: "Podcasts",
    date: "2026-05-18",
    read: "34 min listen",
    image: shot("1507668077129-56e32842fceb", "Microphone in recording studio", "#312e81"),
    brief: "Deep dive with cognitive scientists into quantifying conceptual transfer without multiple-choice bias."
  },
  {
    id: "r4",
    title: "Overcoming the Illusion of Competence: How Socratic AI Probing Destroys Rote Memorization",
    kind: "Blog",
    date: "2026-06-01",
    read: "5 min read",
    image: shot("1516321318423-f06f85e504b3", "Laptops and glowing screens in lecture room", "#1e1b4b"),
    brief: "Passive rereading creates fake fluency. Explaining to an empty vessel exposes true cognitive gaps."
  },
  {
    id: "r5",
    title: "Benchmarking Flagship Reasoners (120B) as Objective Ground-Truth Educational Judges",
    kind: "Knowledge",
    date: "2026-07-22",
    read: "9 min read",
    image: shot("1524995997946-a1c2e315a42f", "Bookshelves with architectural perspective", "#1e293b"),
    brief: "Analyzing rubric calibration, grading variance, and adversarial defense in automated exam assessment."
  },
  {
    id: "r6",
    title: "From Medical School to Quantum Electrodynamics: Student Journeys with Study Buddy",
    kind: "Podcasts",
    date: "2026-08-14",
    read: "42 min listen",
    image: shot("1517842645767-c639042777db", "Scholars engaged in active technical discussion", "#0f172a"),
    brief: "Interviews with three high-achieving scholars who replaced flashcards with active Socratic teaching."
  }
]

const MARQUEE_CONCEPTS = [
  "Backpropagation",
  "Schrödinger Equation",
  "Bayesian Inference",
  "Heisenberg Uncertainty",
  "Virtual Memory",
  "Krebs Cycle",
  "Nash Equilibrium",
  "Enthalpy",
  "Epigenetics",
  "Turing Completeness",
  "Eigenvalues",
  "Markov Chains",
  "Synaptic Plasticity",
  "Fourier Transform",
  "Central Limit Theorem",
  "Amortized Analysis",
  "General Relativity",
  "Keynesian Multiplier",
  "Polymerase Chain Reaction",
  "CAP Theorem"
]

const PLANNER_STAGES = [
  {
    tab: "01. Diagnostic Cold Test",
    eyebrow: "Stage 01 • Baseline Assessment",
    title: "Establish baseline without guessing",
    text: "Before you explain a single sentence, our 120B Teacher Agent administers a diagnostic exam to the Child Agent with zero knowledge. This establishes the true, cold baseline score.",
    points: [
      "Zero syllabus leakage guaranteed",
      "Establishes pre-teaching benchmark"
    ]
  },
  {
    tab: "02. Voice & Text Teaching",
    eyebrow: "Stage 02 • Socratic Dialogue",
    title: "Teach like Feynman. Simplify until it clicks.",
    text: "Speak or type in plain language. The Child Agent asks curious, probing questions, challenges fuzzy reasoning, and builds real neural memory in real time.",
    points: [
      "Real-time speech transcription via Groq Whisper",
      "Child Agent surfaces cognitive blind spots"
    ]
  },
  {
    tab: "03. 120B Evaluation & TES",
    eyebrow: "Stage 03 • Verifiable Verification",
    title: "Objective proof of your knowledge transfer",
    text: "The Teacher Agent (120B Flagship) administers the final exam. Compare baseline vs. final answers side-by-side and calculate your Teaching Effectiveness Score (TES).",
    points: [
      "Granular rubric scoring per concept",
      "Instant PDF export of learning analytics"
    ]
  }
]

// ---------------- Inline CSS Styles ----------------

const CSS_STYLES = `
.sb-root {
  --sb-bg: #f8fafc;
  --sb-surface: #f1f5f9;
  --sb-card: #ffffff;
  --sb-ink: #0f172a;
  --sb-muted: #64748b;
  --sb-line: rgba(15, 23, 42, 0.08);
  --sb-accent: #2563eb;
  --sb-accent-glow: rgba(37, 99, 235, 0.18);
  --sb-soft: #dbeafe;
  --sb-peach: #fff1f2;
  --sb-sage: #ecfdf5;
  --sb-sky: #eff6ff;
  --sb-shadow: 0 1px 3px rgba(15, 23, 42, 0.05), 0 16px 36px -12px rgba(15, 23, 42, 0.12);
  --sb-serif: "Instrument Serif", Georgia, Cambria, serif;
  --sb-sans: "Inter", system-ui, -apple-system, sans-serif;
  position: relative;
  min-height: 100vh;
  background: var(--sb-bg);
  color: var(--sb-ink);
  font-family: var(--sb-sans);
  font-size: 15px;
  line-height: 1.5;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease, color 0.3s ease;
}

.sb-root[data-theme="dark"] {
  --sb-bg: #07090e;
  --sb-surface: #0f131c;
  --sb-card: #151b27;
  --sb-ink: #f8fafc;
  --sb-muted: #94a3b8;
  --sb-line: rgba(248, 250, 252, 0.08);
  --sb-accent: #3b82f6;
  --sb-accent-glow: rgba(59, 130, 246, 0.28);
  --sb-soft: #1e293b;
  --sb-peach: #2a1518;
  --sb-sage: #0d281e;
  --sb-sky: #132238;
  --sb-shadow: 0 1px 3px rgba(0, 0, 0, 0.5), 0 20px 48px -16px rgba(0, 0, 0, 0.7);
}

.sb-root * { box-sizing: border-box; }
.sb-serif { font-family: var(--sb-serif); letter-spacing: -0.015em; font-weight: 400; }
.sb-h2 { font-family: var(--sb-serif); font-size: clamp(34px, 5.2vw, 58px); line-height: 1.04; letter-spacing: -0.025em; text-wrap: balance; }
.sb-lede { color: var(--sb-muted); max-width: 48ch; font-size: 15px; line-height: 1.6; }
.sb-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.sb-wi { display: inline-block; will-change: transform; }
.sb-wrap { width: min(1200px, 100% - 36px); margin-inline: auto; }
.sb-sec { padding-block: clamp(72px, 10vw, 130px); }
.sb-center { text-align: center; display: grid; justify-items: center; gap: 14px; }

/* Buttons */
.sb-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px 0 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.25s, box-shadow 0.25s;
  cursor: pointer;
  border: none;
}
.sb-btn:hover { transform: translateY(-1px); }
.sb-btn:active { transform: translateY(0) scale(0.97); }
.sb-btn-accent {
  background: var(--sb-accent);
  color: #ffffff;
  box-shadow: 0 8px 24px -8px var(--sb-accent);
}
.sb-btn-light {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.3);
}
.sb-btn-ghost {
  background: var(--sb-card);
  color: var(--sb-ink);
  box-shadow: inset 0 0 0 1px var(--sb-line);
}
.sb-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.9; }

/* Chip */
.sb-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--sb-card);
  box-shadow: inset 0 0 0 1px var(--sb-line);
  color: var(--sb-ink);
  white-space: nowrap;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.sb-chip[aria-pressed="true"] {
  background: var(--sb-accent);
  color: #ffffff;
  box-shadow: none;
}

/* Picture */
.sb-pic {
  position: relative;
  overflow: hidden;
  background: var(--tone, #334155);
}
.sb-pic img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-pic[data-state="ok"] img { opacity: 1; }
.sb-pic[data-state="failed"] img { display: none; }

/* Navigation */
.sb-navwrap { position: sticky; top: 0; z-index: 60; height: 0; }
.sb-nav {
  position: absolute;
  left: 50%;
  top: 14px;
  transform: translateX(-50%);
  width: min(1200px, 100% - 32px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  height: 54px;
  padding: 0 10px 0 18px;
  border-radius: 999px;
  color: #ffffff;
  transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s, color 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
}
.sb-nav[data-compact="true"] {
  width: min(920px, 100% - 24px);
  background: color-mix(in srgb, var(--sb-bg) 82%, transparent);
  color: var(--sb-ink);
  box-shadow: 0 0 0 1px var(--sb-line), 0 12px 36px -12px rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  backdrop-filter: blur(18px) saturate(1.4);
}
.sb-nav-links { display: flex; gap: 4px; }
.sb-nav-links a {
  font-size: 13px;
  padding: 7px 12px;
  border-radius: 999px;
  opacity: 0.88;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s, opacity 0.2s;
}
.sb-nav-links a:hover {
  opacity: 1;
  background: color-mix(in srgb, currentColor 12%, transparent);
}
.sb-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
  color: inherit;
  text-decoration: none;
}
.sb-nav-end { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
.sb-iconbtn {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.sb-iconbtn:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
.sb-badge {
  position: absolute;
  top: 2px;
  right: 0;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 99px;
  background: var(--sb-accent);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: center;
}
.sb-menu-btn { display: none; }
.sb-sheet {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 24px);
  padding: 12px;
  border-radius: 24px;
  background: var(--sb-card);
  color: var(--sb-ink);
  box-shadow: var(--sb-shadow), 0 0 0 1px var(--sb-line);
  display: grid;
  gap: 4px;
  animation: sb-drop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-sheet a, .sb-sheet button {
  padding: 12px 14px;
  border-radius: 14px;
  text-align: left;
  font-size: 15px;
  color: inherit;
  text-decoration: none;
  background: none;
  border: none;
}
.sb-sheet a:hover, .sb-sheet button:hover { background: var(--sb-surface); }
@keyframes sb-drop {
  from { opacity: 0; transform: translate(-50%, -8px) scale(0.98); }
}

/* Hero */
.sb-hero { position: relative; min-height: 100svh; display: grid; }
.sb-hero-frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0f172a;
  will-change: clip-path;
}
.sb-hero-img { position: absolute; inset: -6% 0 0 0; }
.sb-hero-img .sb-pic { position: absolute; inset: 0; }
.sb-hero-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(7, 9, 14, 0.5) 0%,
    rgba(7, 9, 14, 0.15) 30%,
    rgba(7, 9, 14, 0.3) 55%,
    rgba(7, 9, 14, 0.85) 100%
  );
}
.sb-hero-copy {
  position: relative;
  z-index: 2;
  align-self: end;
  justify-self: center;
  text-align: center;
  color: #ffffff;
  padding: 0 18px clamp(56px, 9vh, 96px);
  display: grid;
  justify-items: center;
  gap: 18px;
}
.sb-hero h1 {
  font-family: var(--sb-serif);
  font-weight: 400;
  font-size: clamp(44px, 7.5vw, 92px);
  line-height: 0.98;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 32px rgba(0, 0, 0, 0.4);
}
.sb-hero p {
  max-width: 50ch;
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.9;
}
.sb-plate {
  position: absolute;
  z-index: 3;
  right: max(24px, 6vw);
  top: 26%;
  width: 228px;
  padding: 12px;
  border-radius: 22px;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: blur(18px) saturate(1.5);
  backdrop-filter: blur(18px) saturate(1.5);
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.5);
  display: grid;
  gap: 8px;
}
.sb-plate .sb-pic { height: 104px; border-radius: 14px; }
.sb-plate b { font-size: 13px; font-weight: 600; }
.sb-plate small { font-size: 11px; color: #475569; }
.sb-plate-bars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  font-size: 10px;
  color: #475569;
}
.sb-bar {
  height: 4px;
  border-radius: 9px;
  background: rgba(15, 23, 42, 0.1);
  overflow: hidden;
  margin-top: 3px;
}
.sb-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--sb-accent);
  transform-origin: left;
}
.sb-scrollcue {
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  width: 24px;
  height: 36px;
  border-radius: 99px;
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.6);
}
.sb-scrollcue::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 7px;
  width: 3px;
  height: 8px;
  margin-left: -1.5px;
  border-radius: 9px;
  background: #ffffff;
  animation: sb-cue 1.8s ease-in-out infinite;
}
@keyframes sb-cue {
  0% { opacity: 0; transform: translateY(0); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translateY(12px); }
}

/* Features */
.sb-feats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 4vw, 56px);
  padding-block: clamp(64px, 9vw, 110px) clamp(40px, 6vw, 70px);
}
.sb-feat { display: grid; justify-items: center; text-align: center; gap: 12px; }
.sb-feat-art {
  position: relative;
  width: 150px;
  height: 114px;
  display: grid;
  place-items: center;
}
.sb-feat-art svg { transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.sb-feat:hover .sb-feat-art svg { transform: translateY(-6px) rotate(-3deg) scale(1.05); }
.sb-feat h3 { font-size: 15px; font-weight: 600; }
.sb-feat p { font-size: 13.5px; color: var(--sb-muted); max-width: 32ch; line-height: 1.5; }
.sb-tag {
  position: absolute;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  background: var(--sb-card);
  box-shadow: var(--sb-shadow);
  white-space: nowrap;
}

/* Planner / The 3 Stages */
.sb-plan-outer { padding-inline: clamp(8px, 1.4vw, 20px); }
.sb-plan {
  position: relative;
  border-radius: clamp(24px, 3vw, 42px);
  background: var(--sb-surface);
  min-height: min(820px, calc(100svh - 84px));
  display: grid;
  align-content: center;
  padding: clamp(32px, 4vw, 52px) 0;
  overflow: hidden;
}
.sb-tabs {
  position: relative;
  justify-self: center;
  display: inline-flex;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: var(--sb-card);
  box-shadow: inset 0 0 0 1px var(--sb-line);
  margin-bottom: clamp(24px, 4vw, 44px);
  max-width: calc(100% - 24px);
  overflow-x: auto;
  scrollbar-width: none;
}
.sb-tab {
  position: relative;
  z-index: 1;
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--sb-muted);
  white-space: nowrap;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s;
}
.sb-tab[aria-selected="true"] { color: #ffffff; }
.sb-tab-ind {
  position: absolute;
  z-index: 0;
  top: 4px;
  height: 34px;
  border-radius: 999px;
  background: var(--sb-accent);
  transition: left 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
}
.sb-tab-ind i {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.18);
  transform-origin: left;
  transform: scaleX(var(--sb-tp, 0));
}
.sb-plan-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(24px, 6vw, 96px);
  padding-inline: clamp(20px, 6vw, 96px);
}
.sb-plan-copy { position: relative; display: grid; }
.sb-plan-pane {
  grid-area: 1 / 1;
  display: grid;
  align-content: center;
  gap: 14px;
  transition: opacity 0.5s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.5s;
}
.sb-plan-pane[data-on="false"] {
  opacity: 0;
  transform: translateY(18px);
  filter: blur(6px);
  pointer-events: none;
}
.sb-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--sb-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.sb-eyebrow i { width: 4px; height: 12px; border-radius: 2px; background: var(--sb-accent); }
.sb-plan-copy h3 {
  font-family: var(--sb-serif);
  font-weight: 400;
  font-size: clamp(34px, 4.2vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.sb-plan-copy p { color: var(--sb-muted); max-width: 44ch; font-size: 14.5px; line-height: 1.6; }
.sb-points {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 22px;
  max-width: 460px;
  list-style: none;
  padding: 0;
}
.sb-points li { display: grid; gap: 8px; font-size: 13px; font-weight: 500; }
.sb-points svg { color: var(--sb-accent); }
.sb-plan-progress { display: flex; gap: 6px; margin-top: 10px; }
.sb-plan-progress span {
  height: 3px;
  width: 32px;
  border-radius: 9px;
  background: var(--sb-line);
  overflow: hidden;
}
.sb-plan-progress span i {
  display: block;
  height: 100%;
  background: var(--sb-accent);
  transform-origin: left;
  transition: transform 0.3s;
}

/* Phone Mockup */
.sb-phone {
  position: relative;
  width: 290px;
  height: 590px;
  flex: none;
  border-radius: 52px;
  padding: 10px;
  background: linear-gradient(145deg, #1e293b, #090d16);
  box-shadow: inset 0 0 0 1.5px #334155, 0 40px 80px -30px rgba(15, 23, 42, 0.6), 0 10px 24px -12px rgba(0, 0, 0, 0.4);
}
.sb-phone::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 20px;
  width: 88px;
  height: 24px;
  margin-left: -44px;
  border-radius: 99px;
  background: #000000;
  z-index: 5;
}
.sb-screen {
  position: relative;
  height: 100%;
  border-radius: 42px;
  overflow: hidden;
  background: #ffffff;
  color: #0f172a;
  font-size: 11.5px;
}
.sb-root[data-theme="dark"] .sb-screen {
  background: #0d121c;
  color: #f8fafc;
}
.sb-status {
  display: flex;
  justify-content: space-between;
  padding: 16px 26px 0;
  font-size: 11px;
  font-weight: 600;
  height: 44px;
}
.sb-scr {
  position: absolute;
  inset: 44px 0 0;
  padding: 6px 14px 14px;
  display: grid;
  align-content: start;
  gap: 10px;
  transition: opacity 0.45s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.45s;
}
.sb-scr[data-on="false"] {
  opacity: 0;
  transform: scale(0.94) translateY(16px);
  filter: blur(4px);
  pointer-events: none;
  visibility: hidden;
}
.sb-scr h4 { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
.sb-ring-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: 16px;
  background: var(--sb-surface);
}
.sb-sub { font-size: 10px; color: var(--sb-muted); }

/* Showcase / Coverflow */
.sb-flow {
  position: relative;
  height: clamp(340px, 42vw, 430px);
  margin-top: clamp(28px, 5vw, 56px);
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  outline: none;
}
.sb-flow:active { cursor: grabbing; }
.sb-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--sb-cw, 280px);
  height: calc(var(--sb-cw, 280px) * 1.18);
  margin: calc(var(--sb-cw, 280px) * -0.59) 0 0 calc(var(--sb-cw, 280px) * -0.5);
  border-radius: 20px;
  overflow: hidden;
  will-change: transform;
  box-shadow: 0 20px 40px -22px rgba(15, 23, 42, 0.5);
}
.sb-card .sb-pic { position: absolute; inset: 0; }
.sb-card[data-center="true"] { box-shadow: 0 32px 64px -24px rgba(15, 23, 42, 0.7); }
.sb-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--sb-bg);
  opacity: var(--sb-fade, 0);
  pointer-events: none;
}
.sb-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  transform: scale(0);
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
  cursor: pointer;
}
.sb-card[data-center="true"] .sb-heart { transform: scale(1); }
.sb-heart[aria-pressed="true"] { color: #ef4444; }
.sb-caption {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 22px;
  min-height: 64px;
  text-align: center;
}
.sb-caption h3 { font-size: 16px; font-weight: 600; margin: 0; }
.sb-pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
}
.sb-pager-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 99px;
  background: var(--sb-surface);
}
.sb-pd {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--sb-ink) 22%, transparent);
  overflow: hidden;
  transition: width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-pd[aria-current="true"] { width: 28px; }
.sb-pd[aria-current="true"] i {
  position: absolute;
  inset: 0;
  background: var(--sb-ink);
  transform-origin: left;
  animation: sb-fill var(--sb-dur, 5s) linear forwards;
}
.sb-pager[data-paused="true"] .sb-pd i { animation-play-state: paused; }
@keyframes sb-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.sb-round {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: none;
  background: var(--sb-surface);
  color: var(--sb-ink);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.sb-round:hover { background: var(--sb-line); transform: scale(1.06); }

/* Bento Grid */
.sb-bento-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: clamp(24px, 4vw, 40px);
}
.sb-bento {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.sb-tile {
  position: relative;
  min-width: 0;
  border-radius: 24px;
  background: var(--sb-surface);
  padding: 22px;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: space-between;
  gap: 14px;
  min-height: 310px;
}
.sb-tile-t { font-size: 13px; color: var(--sb-muted); line-height: 1.5; margin: 0; }
.sb-tile-t b { color: var(--sb-ink); font-weight: 600; }
.sb-wide { grid-column: span 2; }
.sb-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  background: var(--sb-card);
  box-shadow: inset 0 0 0 1px var(--sb-line);
  color: var(--sb-muted);
}
.sb-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: none;
  outline: none;
  font-size: 13.5px;
  color: var(--sb-ink);
}
.sb-filters { display: flex; flex-wrap: wrap; gap: 6px; }
.sb-results {
  display: grid;
  gap: 6px;
  height: 156px;
  overflow-y: auto;
  scrollbar-width: thin;
  align-content: start;
}
.sb-result {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 6px;
  border-radius: 12px;
  background: var(--sb-card);
}
.sb-result .sb-pic { width: 42px; height: 42px; border-radius: 9px; }
.sb-result b { font-size: 12.5px; font-weight: 600; display: block; }
.sb-marquee {
  display: grid;
  gap: 8px;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  margin-inline: -22px;
}
.sb-mrow {
  display: flex;
  gap: 6px;
  width: max-content;
  animation: sb-mq 38s linear infinite;
}
.sb-mrow[data-rev="true"] { animation-direction: reverse; animation-duration: 44s; }
.sb-marquee:hover .sb-mrow, .sb-marquee:focus-within .sb-mrow { animation-play-state: paused; }
@keyframes sb-mq { to { transform: translateX(-50%); } }
.sb-quote {
  font-family: var(--sb-serif);
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.22;
  letter-spacing: -0.015em;
  margin: 0;
}
.sb-who { display: flex; align-items: center; gap: 12px; font-size: 12px; }
.sb-who .sb-pic { width: 38px; height: 38px; border-radius: 50%; }
.sb-who small { display: block; color: var(--sb-muted); font-size: 11px; }

/* Drill / Interactive Simulation */
.sb-drill {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: clamp(28px, 4vw, 44px);
}
.sb-drill-phone {
  grid-row: span 2;
  display: grid;
  justify-items: center;
  align-content: space-between;
  gap: 18px;
  padding: 28px 18px 18px;
}
.sb-drill-phone .sb-phone { width: 254px; height: 516px; }
.sb-stepper {
  display: inline-grid;
  grid-template-columns: 36px 56px 36px;
  align-items: center;
  justify-items: center;
  padding: 4px;
  border-radius: 16px;
  background: var(--sb-card);
}
.sb-stepper output { display: grid; justify-items: center; line-height: 1.1; }
.sb-stepper output b { font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
.sb-stepper output small { font-size: 10px; color: var(--sb-muted); }
.sb-switch { display: inline-flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 500; }
.sb-switch button {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 99px;
  border: none;
  background: var(--sb-accent);
  cursor: pointer;
}
.sb-switch button i {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.sb-switch button[aria-checked="true"] i { transform: translateX(20px); }
.sb-switch span { opacity: 0.5; transition: opacity 0.3s; }
.sb-switch span[data-on="true"] { opacity: 1; font-weight: 600; }

/* Categories */
.sb-cats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: clamp(28px, 4vw, 48px);
}
.sb-cat {
  position: relative;
  flex: 0 0 calc((100% - 56px) / 5);
  aspect-ratio: 1 / 1.04;
  border-radius: 22px;
  background: var(--sb-surface);
  display: grid;
  place-items: center;
  overflow: hidden;
  transition: background 0.35s;
  text-decoration: none;
  color: inherit;
}
.sb-cat:hover { background: var(--sb-sky); }
.sb-cat-spin { display: grid; place-items: center; width: 62%; aspect-ratio: 1; }
.sb-cat .sb-pic {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 0 18px 32px -16px rgba(15, 23, 42, 0.6), inset 0 0 0 4px rgba(255, 255, 255, 0.9);
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-cat:hover .sb-pic { transform: rotate(26deg) scale(1.08) translateY(-6px); }
.sb-cat-l {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  font-weight: 600;
}
.sb-cat-l small {
  font-size: 11px;
  font-weight: 400;
  color: var(--sb-muted);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s, transform 0.3s;
}
.sb-cat:hover .sb-cat-l small { opacity: 1; transform: none; }

/* Resources */
.sb-res {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(24px, 6vw, 80px);
  align-items: start;
}
.sb-articles { display: grid; gap: 6px; min-height: 272px; align-content: start; }
.sb-article {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 8px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: background 0.3s;
}
.sb-article:hover { background: var(--sb-surface); }
.sb-article .sb-pic { height: 68px; border-radius: 12px; }
.sb-article b { font-size: 13.5px; font-weight: 600; display: block; line-height: 1.35; }
.sb-article small { font-size: 11px; color: var(--sb-muted); }
.sb-kinds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
.sb-kind {
  display: grid;
  gap: 2px;
  padding: 12px;
  border-radius: 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: var(--sb-surface);
  color: var(--sb-ink);
  transition: transform 0.3s, box-shadow 0.3s;
}
.sb-kind small { font-weight: 400; font-size: 11px; color: var(--sb-muted); }
.sb-kind:hover { transform: translateY(-2px); }
.sb-kind[aria-pressed="true"] { box-shadow: inset 0 0 0 2px var(--sb-accent); }

/* CTA */
.sb-cta {
  position: relative;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 18px;
  padding-block: clamp(110px, 15vw, 190px);
}
.sb-cta .sb-h2 .sb-wi { color: color-mix(in srgb, var(--sb-ink) var(--sb-lit, 100%), transparent); }
.sb-orbit {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 20px 40px -18px rgba(15, 23, 42, 0.55), inset 0 0 0 3px rgba(255, 255, 255, 0.85);
  pointer-events: none;
}

/* Footer */
.sb-foot {
  margin: 0 auto clamp(12px, 2vw, 24px);
  width: min(1200px, 100% - 24px);
  border-radius: 30px;
  background: var(--sb-surface);
  padding: clamp(28px, 4vw, 48px);
}
.sb-foot-top { display: grid; grid-template-columns: 1.2fr repeat(4, 1fr); gap: 24px; }
.sb-foot h4 { font-size: 12px; font-weight: 600; color: var(--sb-muted); margin-bottom: 12px; }
.sb-foot ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.sb-foot li a {
  display: inline-block;
  font-size: 13px;
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}
.sb-foot li a:hover { opacity: 0.6; transform: translateX(2px); }
.sb-foot-word {
  font-family: var(--sb-serif);
  font-size: clamp(64px, 15vw, 190px);
  line-height: 0.8;
  letter-spacing: -0.04em;
  margin-top: clamp(28px, 5vw, 60px);
  color: color-mix(in srgb, var(--sb-ink) 9%, transparent);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}
.sb-foot-bot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: clamp(40px, 7vw, 90px);
  font-size: 12px;
  color: var(--sb-muted);
}
.sb-foot-bot div { display: flex; gap: 14px; align-items: center; }

/* Responsive */
@media (max-width: 960px) {
  .sb-plan-grid { grid-template-columns: 1fr; justify-items: center; text-align: left; }
  .sb-plan-copy { width: 100%; max-width: 520px; }
  .sb-bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sb-wide { grid-column: 1 / -1; }
  .sb-cat { flex-basis: calc((100% - 28px) / 3); }
  .sb-res { grid-template-columns: 1fr; }
  .sb-foot-top { grid-template-columns: repeat(2, 1fr); }
  .sb-foot-top > div:first-child { grid-column: 1 / -1; }
  .sb-plate { display: none; }
}

@media (max-width: 720px) {
  .sb-nav { grid-template-columns: auto 1fr auto; padding-left: 16px; }
  .sb-nav-links { display: none; }
  .sb-menu-btn { display: grid; }
  .sb-logo { grid-column: 1; grid-row: 1; }
  .sb-nav-end { grid-column: 3; }
  .sb-nav-end .sb-btn { display: none; }
  .sb-feats { grid-template-columns: 1fr; gap: 40px; }
  .sb-bento, .sb-drill { grid-template-columns: minmax(0, 1fr); }
  .sb-drill-phone { grid-row: auto; }
  .sb-cat { flex-basis: calc((100% - 14px) / 2); }
  .sb-kinds { grid-template-columns: 1fr 1fr 1fr; }
  .sb-article { grid-template-columns: 76px 1fr; }
  .sb-points { grid-template-columns: 1fr; }
  .sb-phone { transform: scale(0.92); transform-origin: top center; margin-bottom: -46px; }
}
`

// ---------------- SVG Illustrations ----------------

function FeynmanLoopArt() {
  return (
    <svg width="150" height="114" viewBox="0 0 150 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blackboard easel frame */}
      <rect x="25" y="16" width="100" height="66" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      <rect x="30" y="21" width="90" height="56" rx="4" fill="#0f172a" />
      {/* Easel legs */}
      <path d="M42 82L30 106M108 82L120 106M75 82V106" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      {/* Feynman Diagram squiggle on blackboard */}
      <path d="M42 48Q52 32 62 48T82 48T102 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 1" />
      <circle cx="42" cy="48" r="3.5" fill="#38bdf8" />
      <circle cx="102" cy="48" r="3.5" fill="#38bdf8" />
      <path d="M72 32L78 38L72 44" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Chalk Tray */}
      <rect x="52" y="74" width="22" height="4" rx="2" fill="#ffffff" opacity="0.9" />
      <rect x="78" y="74" width="14" height="4" rx="2" fill="#facc15" />
    </svg>
  )
}

function CognitiveShieldArt() {
  return (
    <svg width="150" height="114" viewBox="0 0 150 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer shield boundary */}
      <path d="M75 14L114 28V62C114 85 75 102 75 102C75 102 36 85 36 62V28L75 14Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
      {/* Safety firewall lock */}
      <rect x="63" y="52" width="24" height="20" rx="5" fill="#3b82f6" />
      <path d="M68 52V44C68 40.134 71.134 37 75 37C78.866 37 82 40.134 82 44V52" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="75" cy="62" r="2.5" fill="#ffffff" />
      {/* Neural Synapse Dots */}
      <circle cx="50" cy="48" r="3" fill="#38bdf8" opacity="0.8" />
      <circle cx="100" cy="48" r="3" fill="#38bdf8" opacity="0.8" />
      <circle cx="52" cy="72" r="2.5" fill="#a855f7" opacity="0.8" />
      <circle cx="98" cy="72" r="2.5" fill="#a855f7" opacity="0.8" />
      <path d="M50 48L63 56M100 48L87 56" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
    </svg>
  )
}

function TesGaugeArt() {
  return (
    <svg width="150" height="114" viewBox="0 0 150 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circular dial background */}
      <circle cx="75" cy="57" r="42" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      {/* Dial arc */}
      <path d="M46 78A36 36 0 1 1 104 78" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
      {/* Needle pointing to top score */}
      <path d="M75 57L94 36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <circle cx="75" cy="57" r="5" fill="#ffffff" />
      {/* Delta symbol Δ */}
      <text x="75" y="80" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700">Δ TES</text>
    </svg>
  )
}

// ---------------- Supporting Components ----------------

function Words({ text }: { text: string }) {
  const parts = text.split("\n")
  return (
    <>
      {parts.map((p, pi) => (
        <span key={pi} className="sb-w">
          {p.split(/\s+/).filter(Boolean).map((w, wi) => (
            <span key={wi} className="sb-w" style={{ marginRight: "0.22em" }}>
              <span className="sb-wi">{w}</span>
            </span>
          ))}
          {pi < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}

function Pic({
  shot: s,
  w,
  h,
  eager,
  className,
  style
}: {
  shot: SubjectShot
  w: number
  h?: number
  eager?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const [state, setState] = React.useState("load" as "load" | "ok" | "failed")
  const url = s.src + `?w=${w}${h ? `&h=${h}&fit=crop` : ""}&auto=format&fit=crop&q=80`

  return (
    <div
      className={"sb-pic " + (className || "")}
      data-state={state}
      style={{ ...style, "--tone": s.tone || "#334155" } as React.CSSProperties}
    >
      <img
        src={url}
        alt={s.alt || ""}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setState("ok")}
        onError={() => setState("failed")}
        style={{ objectPosition: s.focus || "50% 50%" }}
      />
    </div>
  )
}

function PhoneStatusBar() {
  return (
    <div className="sb-status" aria-hidden="true">
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="15" height="10" viewBox="0 0 16 10">
          <path d="M1 9h2V7H1zM5 9h2V5H5zM9 9h2V3H9zM13 9h2V1h-2z" fill="currentColor" />
        </svg>
        <svg width="20" height="10" viewBox="0 0 22 11">
          <rect x=".5" y=".5" width="18" height="10" rx="3" fill="none" stroke="currentColor" opacity=".5" />
          <rect x="2" y="2" width="13" height="7" rx="1.6" fill="currentColor" />
          <rect x="19.5" y="3.5" width="1.6" height="4" rx=".8" fill="currentColor" opacity=".5" />
        </svg>
      </span>
    </div>
  )
}

// ---------------- Planner Phone Screens ----------------

function PlannerPhoneMockup({ tab }: { tab: number }) {
  const [checkedConcepts, setCheckedConcepts] = React.useState<string[]>([
    "De Broglie Hypothesis",
    "Wavefunction Superposition"
  ])

  const toggleConcept = (c: string) => {
    setCheckedConcepts((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    )
  }

  return (
    <div className="sb-phone">
      <div className="sb-screen">
        <PhoneStatusBar />

        {/* Screen 0: Baseline Diagnostic Test */}
        <div className="sb-scr" data-on={tab === 0} aria-hidden={tab !== 0}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h4>Cold Baseline Test</h4>
            <span className="sb-sub">Step 01 • Teacher 120B</span>
          </div>

          <div className="sb-ring-row">
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" fill="none" stroke="var(--sb-line)" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="144"
                  strokeDashoffset="122"
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                15%
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12 }}>Untaught Child Agent</div>
              <p className="sb-sub" style={{ margin: "2px 0 0" }}>
                Zero document access. Has not received student guidance yet.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: 6, marginTop: 4 }}>
            {[
              { q: "Explain why electrons exhibit interference patterns.", st: "Failed (0/10)" },
              { q: "What determines de Broglie wavelength?", st: "Failed (2/10)" },
              { q: "How does photon energy relate to frequency?", st: "Partial (4/10)" }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: 12,
                  background: "var(--sb-surface)",
                  display: "grid",
                  gap: 3
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600 }}>{item.q}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>{item.st}</span>
                  <span className="sb-sub">Needs Teaching</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screen 1: Voice & Text Socratic Teaching */}
        <div className="sb-scr" data-on={tab === 1} aria-hidden={tab !== 1}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h4>Teaching Dialogue</h4>
            <span className="sb-sub">Step 02 • Socratic Loop</span>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              background: "var(--sb-accent)",
              color: "#ffffff",
              display: "grid",
              gap: 3
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, opacity: 0.9 }}>
              <Mic size={12} /> Student Voice Explanation
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.35 }}>
              "Think of light as tiny packets of ripples. Higher frequency means tighter, more energetic ripples."
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              background: "var(--sb-surface)",
              display: "grid",
              gap: 4
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--sb-accent)", fontWeight: 700 }}>
              <BrainCircuit size={12} /> Child Agent Question
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.35 }}>
              "Wait! If baseballs have ripples too, why don't they spread out when thrown through a window?"
            </div>
          </div>

          <div style={{ display: "grid", gap: 4, marginTop: 4 }}>
            <span className="sb-sub" style={{ fontWeight: 700, textTransform: "uppercase" }}>
              Active Knowledge Formation:
            </span>
            {[
              "De Broglie Hypothesis",
              "Wavefunction Superposition",
              "Planck's Constant Scale Bound",
              "Macroscopic Coherence Loss"
            ].map((c) => (
              <button
                key={c}
                onClick={() => toggleConcept(c)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "none",
                  background: checkedConcepts.includes(c) ? "var(--sb-soft)" : "var(--sb-surface)",
                  color: "var(--sb-ink)",
                  cursor: "pointer",
                  fontSize: 10.5,
                  textAlign: "left"
                }}
              >
                <span>{c}</span>
                {checkedConcepts.includes(c) ? (
                  <CheckCircle2 size={13} style={{ color: "var(--sb-accent)" }} />
                ) : (
                  <span style={{ fontSize: 9, color: "var(--sb-muted)" }}>Pending</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Screen 2: 120B Evaluation & TES Metric */}
        <div className="sb-scr" data-on={tab === 2} aria-hidden={tab !== 2}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h4>Final Exam & TES</h4>
            <span className="sb-sub">Step 03 • Objective Proof</span>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              color: "#ffffff",
              display: "grid",
              gap: 8
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "#38bdf8" }}>
                Teaching Effectiveness
              </span>
              <span style={{ background: "#22c55e", padding: "2px 6px", borderRadius: 99, fontSize: 9.5, fontWeight: 700 }}>
                High Transfer
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--sb-sans)" }}>89</span>
              <span style={{ fontSize: 13, opacity: 0.7 }}>/ 100 TES</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10 }}>
              <div>
                <span style={{ opacity: 0.7 }}>Cold Baseline:</span>
                <div style={{ fontWeight: 700, color: "#f87171" }}>15% Score</div>
              </div>
              <div>
                <span style={{ opacity: 0.7 }}>Final Post-Teaching:</span>
                <div style={{ fontWeight: 700, color: "#4ade80" }}>92% (+77% Δ)</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 5, marginTop: 4 }}>
            <span className="sb-sub" style={{ fontWeight: 700, textTransform: "uppercase" }}>
              Verified Concept Breakdown:
            </span>
            {[
              { name: "Matter Waves", score: "96%", grade: "Mastered" },
              { name: "Diffraction Limits", score: "90%", grade: "Mastered" },
              { name: "Uncertainty Principle", score: "84%", grade: "Solid" }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 8px",
                  borderRadius: 10,
                  background: "var(--sb-surface)",
                  fontSize: 10.5
                }}
              >
                <b>{item.name}</b>
                <span style={{ color: "var(--sb-accent)", fontWeight: 700 }}>
                  {item.score} ({item.grade})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabbar */}
        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 14,
            height: 44,
            borderRadius: 99,
            background: "var(--sb-surface)",
            boxShadow: "inset 0 0 0 1px var(--sb-line)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            color: "var(--sb-muted)"
          }}
        >
          <span style={{ color: tab === 0 ? "var(--sb-accent)" : "inherit" }}>
            <Clock size={16} />
          </span>
          <span style={{ color: tab === 1 ? "var(--sb-accent)" : "inherit" }}>
            <Mic size={16} />
          </span>
          <span style={{ color: tab === 2 ? "var(--sb-accent)" : "inherit" }}>
            <TrendingUp size={16} />
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------- Showcase / Coverflow ----------------

function SubjectsShowcase({
  subjects,
  saved,
  onSave
}: {
  subjects: SubjectCard[]
  saved: string[]
  onSave: (s: SubjectCard) => void
}) {
  const n = subjects.length
  const [idx, setIdx] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const flowRef = React.useRef<HTMLDivElement | null>(null)
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([])
  const st = React.useRef({
    pos: 0,
    unit: 210,
    tween: null as gsap.core.Tween | null
  })

  const layout = React.useCallback(() => {
    const s = st.current
    cardsRef.current.forEach((el, i) => {
      if (!el) return
      let d = i - s.pos
      while (d > n / 2) d -= n
      while (d < -n / 2) d += n
      const x = d * s.unit
      const scale = Math.max(0.68, 1 - Math.abs(d) * 0.18)
      const opacity = Math.max(0.2, 1 - Math.abs(d) * 0.32)
      const zIndex = 100 - Math.round(Math.abs(d) * 10)
      gsap.set(el, { x, scale, opacity, zIndex })
      el.style.setProperty("--sb-fade", String(Math.min(0.6, Math.max(0, Math.abs(d) - 0.8) * 0.3)))
      el.dataset.center = String(Math.abs(d) < 0.5)
    })
  }, [n])

  const goTo = React.useCallback(
    (target: number) => {
      const s = st.current
      if (s.tween) s.tween.kill()
      const normalized = ((Math.round(target) % n) + n) % n
      setIdx(normalized)
      s.tween = gsap.to(s, {
        pos: target,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: layout
      })
    },
    [layout, n]
  )

  React.useEffect(() => {
    layout()
  }, [layout])

  // Autoplay timer
  React.useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      goTo(st.current.pos + 1)
    }, 4500)
    return () => clearInterval(timer)
  }, [paused, goTo])

  const activeSubject = subjects[idx] || subjects[0]

  return (
    <div>
      <div
        ref={flowRef}
        className="sb-flow"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-label="Course coverflow"
      >
        {subjects.map((item, i) => {
          const isSaved = saved.includes(item.id)
          return (
            <div
              key={item.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              className="sb-card"
              onClick={() => goTo(st.current.pos + (i - (idx % n)))}
            >
              <Pic shot={item.image} w={560} h={640} />
              <button
                className="sb-heart"
                aria-pressed={isSaved}
                onClick={(e) => {
                  e.stopPropagation()
                  onSave(item)
                }}
                title={isSaved ? "Remove from study plan" : "Save to my study plan"}
              >
                <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          )
        })}
      </div>

      <div className="sb-caption">
        <h3>{activeSubject.name}</h3>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <span className="sb-chip">
            <Compass size={12} /> {activeSubject.domain}
          </span>
          <span className="sb-chip">
            <Layers size={12} /> {activeSubject.conceptsCount} Core Concepts
          </span>
          <span className="sb-chip">
            <Clock size={12} /> ~{activeSubject.time} min drill
          </span>
        </div>
      </div>

      <div className="sb-pager" data-paused={paused}>
        <button className="sb-round" onClick={() => goTo(st.current.pos - 1)} aria-label="Previous subject">
          ←
        </button>
        <div className="sb-pager-dots">
          {subjects.map((_, i) => (
            <span key={i} className="sb-pd" aria-current={i === idx}>
              <i />
            </span>
          ))}
        </div>
        <button className="sb-round" onClick={() => goTo(st.current.pos + 1)} aria-label="Next subject">
          →
        </button>
      </div>
    </div>
  )
}

// ---------------- Interactive Drill Phone (Feynman Drill) ----------------

function InteractiveDrillPhone({ exercise }: { exercise: DrillExercise }) {
  const [step, setStep] = React.useState(0)
  const [left, setLeft] = React.useState(-1)
  const [running, setRunning] = React.useState(false)
  const currentStep = exercise.steps[step]
  const totalSeconds = currentStep && currentStep.minutes ? currentStep.minutes * 60 : 0

  React.useEffect(() => {
    setRunning(false)
    setLeft(-1)
  }, [step])

  React.useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false)
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [running])

  const shownSeconds = left < 0 ? totalSeconds : left
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  return (
    <div className="sb-phone">
      <div className="sb-screen">
        <PhoneStatusBar />
        <div className="sb-scr" data-on="true" style={{ bottom: 0 }}>
          <div className="sb-sub" style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Feynman Drill
          </div>
          <h4 style={{ fontSize: 13.5, lineHeight: 1.3 }}>{exercise.name}</h4>

          <div className="sb-bar">
            <i style={{ transform: `scaleX(${(step + 1) / exercise.steps.length})` }} />
          </div>

          <div style={{ display: "grid", gap: 5, maxHeight: 240, overflowY: "auto", scrollbarWidth: "none" }}>
            {exercise.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: 8,
                  alignItems: "start",
                  padding: "7px 8px",
                  borderRadius: 12,
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  background: i === step ? "var(--sb-surface)" : "transparent",
                  color: "inherit",
                  opacity: i < step ? 0.5 : 1
                }}
              >
                <i
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontStyle: "normal",
                    fontSize: 10,
                    fontWeight: 700,
                    background: i <= step ? "var(--sb-accent)" : "transparent",
                    color: i <= step ? "#ffffff" : "inherit",
                    boxShadow: i <= step ? "none" : "inset 0 0 0 1px var(--sb-line)"
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </i>
                <span>
                  <b style={{ fontSize: 11.5 }}>{st.title}</b>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "var(--sb-muted)", lineHeight: 1.35 }}>
                    {st.text}
                  </p>
                </span>
              </button>
            ))}
          </div>

          {totalSeconds > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 14,
                background: "var(--sb-accent)",
                color: "#ffffff"
              }}
            >
              <div>
                <small style={{ fontSize: 9.5, opacity: 0.85, display: "block" }}>
                  {left === 0 ? "Drill Completed!" : "Timer Limit"}
                </small>
                <b style={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{formatTime(shownSeconds)}</b>
              </div>
              <button
                onClick={() => {
                  if (left === 0) {
                    setLeft(-1)
                    setRunning(false)
                  } else {
                    if (left < 0) setLeft(totalSeconds)
                    setRunning((r) => !r)
                  }
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 99,
                  border: "none",
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {left === 0 ? "Reset" : running ? "Pause" : left > 0 ? "Resume" : "Start"}
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                background: "var(--sb-surface)",
                fontSize: 11,
                textAlign: "center"
              }}
            >
              Final verification by 120B reasoning model
            </div>
          )}

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setStep((x) => Math.max(0, x - 1))}
              disabled={step === 0}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 99,
                fontSize: 11.5,
                fontWeight: 600,
                border: "none",
                background: "var(--sb-surface)",
                color: "inherit",
                cursor: step === 0 ? "default" : "pointer",
                opacity: step === 0 ? 0.4 : 1
              }}
            >
              Back
            </button>
            <button
              onClick={() => setStep((x) => (x + 1) % exercise.steps.length)}
              style={{
                flex: 1,
                height: 34,
                borderRadius: 99,
                fontSize: 11.5,
                fontWeight: 600,
                border: "none",
                background: "var(--sb-accent)",
                color: "#ffffff",
                cursor: "pointer"
              }}
            >
              {step === exercise.steps.length - 1 ? "Start Over" : "Next Step"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ================= MAIN LANDING PAGE COMPONENT =================

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onOpenAuth,
  onGoToDashboard
}) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const heroRef = React.useRef<HTMLElement | null>(null)
  const planRef = React.useRef<HTMLDivElement | null>(null)
  const planTrig = React.useRef<ScrollTrigger | null>(null)
  const tabsRef = React.useRef<HTMLDivElement | null>(null)

  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const isDark = theme === "dark"

  const [compact, setCompact] = React.useState(false)
  const [mobileMenu, setMobileMenu] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(0)
  const [savedSubjects, setSavedSubjects] = React.useState<string[]>([
    "quantum-electrodynamics",
    "neural-attention"
  ])
  const [tabIndicator, setTabIndicator] = React.useState({ left: 4, width: 0 })

  // Bento state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchDomain, setSearchDomain] = React.useState<string>("all")
  const [trackedConcepts, setTrackedConcepts] = React.useState<string[]>([
    "Backpropagation",
    "Heisenberg Uncertainty",
    "Schrödinger Equation"
  ])

  // Drill state
  const [targetConcepts, setTargetConcepts] = React.useState(DEFAULT_DRILL.targetConcepts)
  const [explanationMode, setExplanationMode] = React.useState<"layman" | "rigorous">("layman")

  // Research articles filter
  const [articleKind, setArticleKind] = React.useState<string>("")

  // Toggle Save Course
  const toggleSaveSubject = (s: SubjectCard) => {
    setSavedSubjects((prev) =>
      prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
    )
  }

  // Filtered Bento Subjects
  const filteredBento = DEFAULT_SUBJECTS.filter((s) => {
    const matchesQuery =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.brief.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = searchDomain === "all" || s.domain.toLowerCase() === searchDomain
    return matchesQuery && matchesDomain
  })

  // Filtered Articles
  const displayedArticles = DEFAULT_ARTICLES.filter(
    (a) => !articleKind || a.kind === articleKind
  ).slice(0, 4)

  // Tab indicator measurement
  React.useEffect(() => {
    const box = tabsRef.current
    if (!box) return
    const updatePosition = () => {
      const activeEl = box.querySelectorAll(".sb-tab")[activeTab] as HTMLElement | undefined
      if (activeEl) {
        setTabIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
      }
    }
    updatePosition()
    const ro = new ResizeObserver(updatePosition)
    ro.observe(box)
    return () => ro.disconnect()
  }, [activeTab])

  // GSAP animations
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let mm: gsap.MatchMedia | null = null
    const ctx = gsap.context(() => {
      // Navbar compact state
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "bottom 90px",
          onEnter: () => setCompact(true),
          onLeaveBack: () => setCompact(false)
        })
      }

      mm = gsap.matchMedia()
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desk: "(min-width: 961px)" }, (c) => {
        const { desk } = c.conditions as { desk: boolean }

        // Pinned planner scene
        if (planRef.current && desk) {
          planTrig.current = ScrollTrigger.create({
            trigger: planRef.current,
            start: "top top+=10",
            end: "+=220%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            snap: {
              snapTo: (v) => Math.round(v * 2) / 2,
              duration: { min: 0.25, max: 0.6 },
              ease: "power2.inOut"
            },
            onUpdate: (self) => {
              const current = Math.min(2, Math.floor(self.progress * 3))
              setActiveTab(current)
              root.style.setProperty("--sb-tp", String(self.progress))
            }
          })
        }

        // Hero opening timeline
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } })
        intro
          .from(".sb-hero-img .sb-pic", { scale: 1.18, duration: 2.2, ease: "power3.out" }, 0)
          .fromTo(
            ".sb-hero-frame",
            { clipPath: "inset(12% 8% 12% 8% round 48px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut" },
            0
          )
          .from(".sb-nav", { y: -30, autoAlpha: 0, duration: 1 }, 0.7)
          .from(".sb-hero h1 .sb-wi", { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.06 }, 0.8)
          .from(".sb-hero-copy > :not(h1)", { y: 20, autoAlpha: 0, duration: 1, stagger: 0.1 }, 1.2)
          .from(".sb-plate", { y: 40, scale: 0.85, rotate: -6, autoAlpha: 0, duration: 1.2, ease: "back.out(1.6)" }, 1.4)

        // Scroll away fold
        if (heroRef.current) {
          const out = gsap.timeline({
            scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 0.6 }
          })
          out
            .fromTo(".sb-hero-frame", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(6% 3% 4% 3% round 40px)", ease: "none" }, 0)
            .to(".sb-hero-img", { yPercent: 14, scale: 1.08, ease: "none" }, 0)
            .to(".sb-hero-copy", { yPercent: -40, autoAlpha: 0.1, ease: "none" }, 0)
            .to(".sb-plate", { yPercent: -120, ease: "none" }, 0)
        }

        // Split text titles
        gsap.utils.toArray("[data-sb-split]").forEach((el) => {
          const words = (el as HTMLElement).querySelectorAll(".sb-wi")
          gsap.from(words, {
            yPercent: 115,
            rotate: 3,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el as HTMLElement, start: "top 86%" }
          })
        })

        // Features spring in
        gsap.from(".sb-feat", {
          y: 50,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".sb-feats", start: "top 82%" }
        })

        // CTA illuminated text
        const ctaEl = root.querySelector(".sb-cta")
        if (ctaEl) {
          const words = ctaEl.querySelectorAll(".sb-wi")
          gsap.fromTo(
            words,
            { "--sb-lit": "18%" },
            {
              "--sb-lit": "100%",
              ease: "none",
              stagger: 0.25,
              scrollTrigger: { trigger: ctaEl, start: "top 75%", end: "center 45%", scrub: 0.5 }
            }
          )
        }
      })
    }, root)

    return () => {
      if (mm) mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className="sb-root" data-theme={isDark ? "dark" : "light"}>
      <style>{CSS_STYLES}</style>

      {/* Google Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
      />

      {/* Navigation Header */}
      <div className="sb-navwrap">
        <nav className="sb-nav" data-compact={compact || mobileMenu} aria-label="Main Navigation">
          <div className="sb-nav-links">
            <a href="#workflow">Feynman Method</a>
            <a href="#stages">The 3 Stages</a>
            <a href="#subjects">Subjects</a>
            <a href="#drill">Live Drill</a>
            <a href="#research">Research</a>
          </div>

          <a
            href="#"
            className="sb-logo"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span>Study Buddy</span>
          </a>

          <div className="sb-nav-end">
            <button
              className="sb-iconbtn"
              title={`${savedSubjects.length} saved courses`}
              onClick={() => {
                const el = document.getElementById("subjects")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <Heart size={18} fill={savedSubjects.length > 0 ? "currentColor" : "none"} />
              {savedSubjects.length > 0 && <span className="sb-badge">{savedSubjects.length}</span>}
            </button>

            <button
              className="sb-iconbtn"
              onClick={toggleTheme}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <button className="sb-btn sb-btn-accent" onClick={onGoToDashboard}>
                <span className="sb-dot" /> Dashboard
              </button>
            ) : (
              <button className="sb-btn sb-btn-accent" onClick={() => onOpenAuth("login")}>
                <span className="sb-dot" /> Sign In
              </button>
            )}

            <button
              className="sb-iconbtn sb-menu-btn"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenu((m) => !m)}
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {mobileMenu && (
          <div className="sb-sheet" role="menu">
            <a href="#workflow" onClick={() => setMobileMenu(false)}>
              Feynman Method
            </a>
            <a href="#stages" onClick={() => setMobileMenu(false)}>
              The 3 Stages
            </a>
            <a href="#subjects" onClick={() => setMobileMenu(false)}>
              Subjects
            </a>
            <a href="#drill" onClick={() => setMobileMenu(false)}>
              Live Drill
            </a>
            <a href="#research" onClick={() => setMobileMenu(false)}>
              Research
            </a>
            <button
              onClick={() => {
                setMobileMenu(false)
                onStart()
              }}
              style={{ color: "var(--sb-accent)", fontWeight: 700 }}
            >
              Launch Learning Tool →
            </button>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <header ref={heroRef} className="sb-hero">
        <div className="sb-hero-frame">
          <div className="sb-hero-img">
            <Pic
              shot={shot("1541339907198-e08756dedf3f", "Atmospheric grand university library", "#0f172a")}
              w={2400}
              eager
            />
          </div>
        </div>

        {/* Floating Today's Feynman Drill Card */}
        <div className="sb-plate" aria-hidden="true">
          <Pic shot={shot("1635070041078-e363dbe005cb", "Quantum interference lasers", "#1e1b4b")} w={460} h={210} eager />
          <div>
            <b>Quantum Mechanics</b>
            <small style={{ display: "block" }}>Wave-Particle Duality & De Broglie</small>
          </div>
          <div className="sb-plate-bars">
            <div>
              Baseline: 15%
              <div className="sb-bar">
                <i style={{ transform: "scaleX(0.15)", background: "#ef4444" }} />
              </div>
            </div>
            <div>
              Final: 92%
              <div className="sb-bar">
                <i style={{ transform: "scaleX(0.92)", background: "#22c55e" }} />
              </div>
            </div>
            <div>
              TES: 89
              <div className="sb-bar">
                <i style={{ transform: "scaleX(0.89)", background: "var(--sb-accent)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="sb-hero-copy">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
            <Sparkles size={13} className="text-blue-400" />
            Neural Feynman Engine • 120B Flagship Reasoning
          </div>
          <h1>
            <Words text={"The fastest way\nto learn is to teach."} />
          </h1>
          <p>
            Upload your syllabus, lecture slides, or textbook. Study Buddy extracts core concepts and spawns an AI student with zero knowledge. Teach it step-by-step—and prove your true mastery when our 120B Teacher Agent evaluates the results.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="sb-btn sb-btn-light" onClick={onStart}>
              <span className="sb-dot" style={{ background: "var(--sb-accent)" }} />
              Start Feynman Drill Free
            </button>
            <button
              className="sb-btn sb-btn-ghost"
              style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)" }}
              onClick={() => onOpenAuth("login")}
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>

        <div className="sb-scrollcue" aria-hidden="true" />
      </header>

      {/* Features Section: The 3 Core Pillars */}
      <section id="workflow" className="sb-wrap sb-feats" aria-label="Why it works">
        <div className="sb-feat">
          <div className="sb-feat-art">
            <FeynmanLoopArt />
          </div>
          <h3>The Feynman Pedagogical Loop</h3>
          <p>
            You explain complex theorems to the Child Agent in plain English. Forcing yourself to explain to a beginner destroys the illusion of competence.
          </p>
        </div>

        <div className="sb-feat">
          <div className="sb-feat-art">
            <CognitiveShieldArt />
          </div>
          <h3>Strict Cognitive Isolation</h3>
          <p>
            The Child Agent has 0% direct access to your uploaded PDF. It knows only what you personally teach it, preventing AI hallucination.
          </p>
        </div>

        <div className="sb-feat">
          <div className="sb-feat-art">
            <TesGaugeArt />
            <span className="sb-tag" style={{ left: -6, top: 10 }}>
              Δ Score +77%
            </span>
            <span className="sb-tag" style={{ right: -4, top: -6 }}>
              TES 89 / 100
            </span>
          </div>
          <h3>120B Teacher & Objective TES</h3>
          <p>
            Our flagship 120B reasoning model administers cold baseline and final exams, calculating your true Teaching Effectiveness Score.
          </p>
        </div>
      </section>

      {/* Pinned Planner Section: The 3 Stages of Mastery */}
      <section id="stages" className="sb-plan-outer" aria-label="The 3 Stages of Mastery">
        <div ref={planRef}>
          <div className="sb-plan">
            <div ref={tabsRef} className="sb-tabs" role="tablist">
              <span className="sb-tab-ind" style={{ left: tabIndicator.left, width: tabIndicator.width }}>
                <i />
              </span>
              {PLANNER_STAGES.map((p, i) => (
                <button
                  key={p.tab}
                  className="sb-tab"
                  role="tab"
                  aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}
                >
                  {p.tab}
                </button>
              ))}
            </div>

            <div className="sb-plan-grid">
              <div className="sb-plan-copy">
                {PLANNER_STAGES.map((p, i) => (
                  <div key={p.tab} className="sb-plan-pane" data-on={activeTab === i}>
                    <span className="sb-eyebrow">
                      <i />
                      {p.eyebrow}
                    </span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <ul className="sb-points">
                      {p.points.map((pt, j) => (
                        <li key={j}>
                          <ShieldCheck size={18} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="sb-plan-progress" aria-hidden="true">
                      {PLANNER_STAGES.map((_, j) => (
                        <span key={j}>
                          <i style={{ transform: `scaleX(${j < activeTab ? 1 : j === activeTab ? "var(--sb-tp, 1)" : 0})` }} />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <PlannerPhoneMockup tab={activeTab} />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Coverflow Showcase */}
      <section id="subjects" className="sb-sec" aria-label="Explore course subjects">
        <div className="sb-wrap sb-center">
          <h2 className="sb-h2" data-sb-split="">
            <Words text={"Active Mastery Across\nEvery Discipline."} />
          </h2>
          <p className="sb-lede">
            From theoretical quantum mechanics to distributed operating systems. Select any module to preview concepts or upload your own course materials.
          </p>
        </div>
        <SubjectsShowcase
          subjects={DEFAULT_SUBJECTS}
          saved={savedSubjects}
          onSave={toggleSaveSubject}
        />
      </section>

      {/* Bento Grid: Search, Concept Marquee & Testimonials */}
      <section className="sb-wrap" style={{ paddingBottom: "clamp(72px, 10vw, 130px)" }}>
        <div className="sb-bento-head">
          <div>
            <h2 className="sb-h2" data-sb-split="" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
              <Words text={"The Complete Neural\nLearning Architecture."} />
            </h2>
          </div>
          <p className="sb-lede" style={{ maxWidth: "36ch" }}>
            Explore verified concepts, track mastery, and challenge yourself with speech-enabled Socratic reasoning.
          </p>
        </div>

        <div className="sb-bento">
          {/* Tile 1: Live Concept Search */}
          <div className="sb-tile">
            <div style={{ display: "grid", gap: 10 }}>
              <label className="sb-search">
                <Search size={16} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search concepts (e.g. entropy, attention, waves)..."
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ border: "none", background: "none", cursor: "pointer" }}>
                    <X size={14} />
                  </button>
                )}
              </label>

              <div className="sb-filters">
                {[
                  ["all", "All Domains"],
                  ["physics", "Physics"],
                  ["computer science", "CS & AI"],
                  ["biomedical", "Biomedical"],
                  ["mathematics", "Mathematics"]
                ].map(([domainKey, label]) => (
                  <button
                    key={domainKey}
                    className="sb-chip"
                    aria-pressed={searchDomain === domainKey}
                    onClick={() => setSearchDomain(domainKey)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="sb-results">
                {filteredBento.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--sb-muted)", fontSize: 12 }}>
                    No subjects match your query.
                  </div>
                ) : (
                  filteredBento.map((item) => (
                    <div key={item.id} className="sb-result">
                      <Pic shot={item.image} w={84} h={84} />
                      <div>
                        <b>{item.name}</b>
                        <span className="sb-sub">{item.domain} · {item.conceptsCount} Concepts</span>
                      </div>
                      <span className="sb-chip" style={{ fontSize: 10.5 }}>
                        {item.difficulty}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <p className="sb-tile-t">
              <b>Instant Concept Filtration.</b> Filter across physics, mathematics, systems, and biology. {filteredBento.length} of {DEFAULT_SUBJECTS.length} modules visible.
            </p>
          </div>

          {/* Tile 2: Concept Marquee */}
          <div className="sb-tile">
            <div className="sb-marquee">
              <div className="sb-mrow">
                {MARQUEE_CONCEPTS.slice(0, 10).map((c, i) => (
                  <button
                    key={i}
                    className="sb-chip"
                    aria-pressed={trackedConcepts.includes(c)}
                    onClick={() =>
                      setTrackedConcepts((prev) =>
                        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                      )
                    }
                  >
                    {trackedConcepts.includes(c) && <CheckCircle2 size={11} />}
                    {c}
                  </button>
                ))}
              </div>
              <div className="sb-mrow" data-rev="true">
                {MARQUEE_CONCEPTS.slice(10).map((c, i) => (
                  <button
                    key={i}
                    className="sb-chip"
                    aria-pressed={trackedConcepts.includes(c)}
                    onClick={() =>
                      setTrackedConcepts((prev) =>
                        prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                      )
                    }
                  >
                    {trackedConcepts.includes(c) && <CheckCircle2 size={11} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: 16,
                background: "var(--sb-card)",
                boxShadow: "inset 0 0 0 1px var(--sb-line)",
                display: "grid",
                gap: 8
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
                <span>Tracked Concept Mastery</span>
                <span>Feynman Clarity</span>
              </div>
              {trackedConcepts.slice(-3).map((concept) => (
                <div key={concept} style={{ display: "grid", gridTemplateColumns: "100px 1fr 36px", gap: 8, alignItems: "center", fontSize: 11 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{concept}</span>
                  <div className="sb-bar" style={{ margin: 0, height: 6 }}>
                    <i style={{ transform: "scaleX(0.92)" }} />
                  </div>
                  <b style={{ textAlign: "right" }}>92%</b>
                </div>
              ))}
            </div>

            <p className="sb-tile-t">
              <b>Neural Concept Mastery.</b> Track essential concepts across all study sessions. Tracking {trackedConcepts.length} core theoretical topics.
            </p>
          </div>

          {/* Tile 3: Scholar Testimonial 1 */}
          <figure className="sb-tile" style={{ background: "var(--sb-peach)" }}>
            <blockquote className="sb-quote">
              &ldquo;{DEFAULT_TESTIMONIALS[0].quote}&rdquo;
            </blockquote>
            <figcaption className="sb-who">
              {DEFAULT_TESTIMONIALS[0].image && <Pic shot={DEFAULT_TESTIMONIALS[0].image} w={76} h={76} />}
              <div>
                <b>{DEFAULT_TESTIMONIALS[0].name}</b>
                <small>{DEFAULT_TESTIMONIALS[0].role}</small>
              </div>
            </figcaption>
          </figure>

          {/* Tile 4: Professor Testimonial 2 (Wide) */}
          <figure className="sb-tile sb-wide" style={{ background: "var(--sb-sage)" }}>
            <blockquote className="sb-quote">
              &ldquo;{DEFAULT_TESTIMONIALS[1].quote}&rdquo;
            </blockquote>
            <figcaption className="sb-who">
              {DEFAULT_TESTIMONIALS[1].image && <Pic shot={DEFAULT_TESTIMONIALS[1].image} w={84} h={84} />}
              <div>
                <b>{DEFAULT_TESTIMONIALS[1].name}</b>
                <small>{DEFAULT_TESTIMONIALS[1].role}</small>
              </div>
            </figcaption>
          </figure>

          {/* Tile 5: Medical Scholar Testimonial 3 */}
          <figure className="sb-tile" style={{ background: "var(--sb-sky)" }}>
            <blockquote className="sb-quote">
              &ldquo;{DEFAULT_TESTIMONIALS[2].quote}&rdquo;
            </blockquote>
            <figcaption className="sb-who">
              {DEFAULT_TESTIMONIALS[2].image && <Pic shot={DEFAULT_TESTIMONIALS[2].image} w={76} h={76} />}
              <div>
                <b>{DEFAULT_TESTIMONIALS[2].name}</b>
                <small>{DEFAULT_TESTIMONIALS[2].role}</small>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Interactive Feynman Drill Simulator */}
      <section id="drill" className="sb-wrap" style={{ paddingBottom: "clamp(72px, 10vw, 130px)" }}>
        <h2 className="sb-h2" data-sb-split="" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
          <Words text={"Simulate an Active\nFeynman Teaching Session."} />
        </h2>

        <div className="sb-drill">
          {/* Phone preview */}
          <div className="sb-tile sb-drill-phone">
            <InteractiveDrillPhone exercise={DEFAULT_DRILL} />
            <p className="sb-tile-t">
              <b>Interactive Drill Simulator.</b> Full-screen Socratic prompts with step timers to guide your real-time explanations.
            </p>
          </div>

          {/* Stepper Card */}
          <div className="sb-tile" style={{ justifyContent: "center", textAlign: "center" }}>
            <Pic shot={DEFAULT_DRILL.image} w={190} h={190} style={{ margin: "0 auto", borderRadius: "50%" }} />
            <div>
              <b style={{ fontSize: 16 }}>{DEFAULT_DRILL.name}</b>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 6 }}>
                <span className="sb-chip">
                  <Clock size={12} /> {DEFAULT_DRILL.time} min drill
                </span>
                <span className="sb-chip">
                  <Flame size={12} /> High Cognitive Demand
                </span>
              </div>
            </div>

            <div className="sb-stepper" style={{ margin: "0 auto" }}>
              <button
                className="sb-iconbtn"
                onClick={() => setTargetConcepts((c) => Math.max(1, c - 1))}
                disabled={targetConcepts <= 1}
              >
                <Minus size={14} />
              </button>
              <output>
                <b>{targetConcepts}</b>
                <small>Concepts</small>
              </output>
              <button
                className="sb-iconbtn"
                onClick={() => setTargetConcepts((c) => Math.min(12, c + 1))}
                disabled={targetConcepts >= 12}
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="sb-tile-t" style={{ textAlign: "center" }}>
              <b>Target Conceptual Scope.</b> Dial the breadth of concepts the Child Agent will test you on during the session.
            </p>
          </div>

          {/* Layman vs Rigorous Switch */}
          <div className="sb-tile">
            <div style={{ display: "grid", gap: 14 }}>
              <div className="sb-switch" style={{ justifyContent: "center" }}>
                <span data-on={explanationMode === "layman"}>Plain English</span>
                <button
                  role="switch"
                  aria-checked={explanationMode === "rigorous"}
                  onClick={() =>
                    setExplanationMode((m) => (m === "layman" ? "rigorous" : "layman"))
                  }
                >
                  <i />
                </button>
                <span data-on={explanationMode === "rigorous"}>Academic Rigor</span>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: "var(--sb-card)",
                  boxShadow: "inset 0 0 0 1px var(--sb-line)",
                  fontSize: 13,
                  lineHeight: 1.6
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--sb-accent)", marginBottom: 4 }}>
                  {explanationMode === "layman" ? "FEYNMAN ANALOGY MODE" : "GRADUATE RIGOR MODE"}
                </div>
                {explanationMode === "layman"
                  ? DEFAULT_DRILL.laymanExplanation
                  : DEFAULT_DRILL.rigorousExplanation}
              </div>
            </div>
            <p className="sb-tile-t">
              <b>Dual Explanatory Modes.</b> Master concepts by translating dense academic theory into intuitive layman analogies.
            </p>
          </div>
        </div>
      </section>

      {/* Domain Categories */}
      <section className="sb-wrap" style={{ paddingBottom: "clamp(72px, 10vw, 130px)" }}>
        <div className="sb-center">
          <h2 className="sb-h2" data-sb-split="" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
            <Words text={"Explore Academic Domains."} />
          </h2>
        </div>
        <div className="sb-cats">
          {DEFAULT_CATEGORIES.map((c) => (
            <div key={c.name} className="sb-cat">
              <span className="sb-cat-spin">
                <Pic shot={c.image} w={260} h={260} />
              </span>
              <span className="sb-cat-l">
                <span>{c.name}</span>
                <small>{c.count} topics</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Research & Publications Section */}
      <section id="research" className="sb-wrap" style={{ paddingBottom: "clamp(60px, 8vw, 100px)" }}>
        <div className="sb-res">
          <div>
            <h2 className="sb-h2" data-sb-split="" style={{ fontSize: "clamp(30px, 4vw, 44px)" }}>
              <Words text={"Cognitive Science\n& Technical Research."} />
            </h2>
            <p className="sb-lede" style={{ marginTop: 12 }}>
              Read our peer-reviewed whitepapers on LLM cognitive isolation, the mathematics of the TES metric, and empirical trials in university classrooms.
            </p>
          </div>

          <div>
            <div className="sb-articles">
              {displayedArticles.map((a) => (
                <div key={a.id} className="sb-article">
                  <Pic shot={a.image} w={200} h={136} />
                  <div>
                    <b>{a.title}</b>
                    <small>
                      {a.kind} · {a.date} · {a.read}
                    </small>
                  </div>
                  <ArrowRight size={18} style={{ color: "var(--sb-accent)" }} />
                </div>
              ))}
            </div>

            <div className="sb-kinds">
              {(["Knowledge", "Blog", "Podcasts"] as const).map((k) => (
                <button
                  key={k}
                  className="sb-kind"
                  aria-pressed={articleKind === k}
                  onClick={() => setArticleKind((prev) => (prev === k ? "" : k))}
                >
                  {k}
                  <small>
                    {DEFAULT_ARTICLES.filter((a) => a.kind === k).length} {k === "Podcasts" ? "episodes" : "papers"}
                  </small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll-Scrubbed Call To Action */}
      <section className="sb-cta">
        <h2 className="sb-h2 sb-wrap" data-sb-split="">
          <Words text={"Stop rereading.\nStart teaching."} />
        </h2>
        <p className="sb-lede">
          Upload any lecture note or syllabus PDF. Master complex subjects in minutes through the proven Feynman technique.
        </p>
        <button className="sb-btn sb-btn-accent" onClick={onStart} style={{ position: "relative" }}>
          <span className="sb-dot" style={{ background: "#ffffff" }} />
          Launch Study Buddy Free
        </button>
      </section>

      {/* Footer */}
      <footer className="sb-foot">
        <div className="sb-foot-top">
          <div>
            <div className="sb-logo">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <BrainCircuit className="w-3.5 h-3.5" />
              </div>
              <span>Study Buddy</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--sb-muted)", marginTop: 8 }}>
              You teach the AI. That's how you master anything.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#workflow">Feynman Loop</a></li>
              <li><a href="#stages">The 3 Stages</a></li>
              <li><a href="#drill">Live Simulator</a></li>
              <li><a href="#subjects">Course Catalog</a></li>
            </ul>
          </div>

          <div>
            <h4>Architecture</h4>
            <ul>
              <li><a href="#stages">Cognitive Isolation</a></li>
              <li><a href="#stages">120B Teacher Agent</a></li>
              <li><a href="#stages">Groq Cloud Inference</a></li>
              <li><a href="#stages">Supabase PostgreSQL</a></li>
            </ul>
          </div>

          <div>
            <h4>Research</h4>
            <ul>
              <li><a href="#research">Whitepapers</a></li>
              <li><a href="#research">TES Metric Specs</a></li>
              <li><a href="#research">Cognitive Evals</a></li>
              <li><a href="#research">Pedagogy Blog</a></li>
            </ul>
          </div>

          <div>
            <h4>Account</h4>
            <ul>
              <li><button onClick={() => onOpenAuth("login")} style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "inherit" }}>Sign In</button></li>
              <li><button onClick={() => onOpenAuth("register")} style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "inherit" }}>Register</button></li>
              <li><button onClick={onGoToDashboard} style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "inherit" }}>Dashboard</button></li>
            </ul>
          </div>
        </div>

        <div className="sb-foot-word" aria-hidden="true">Study Buddy</div>

        <div className="sb-foot-bot">
          <div>
            <span>&copy; {new Date().getFullYear()} Study Buddy AI. All rights reserved.</span>
          </div>
          <span>Powered by Groq Cloud Inference & Supabase PostgreSQL</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
