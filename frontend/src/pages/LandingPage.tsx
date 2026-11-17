"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { ThemeToggle } from "../components/ThemeToggle"

export type TtlLink = { label: string; href?: string; onClick?: () => void }

export type TtlNav = {
  products?: { label: string; text: string; href?: string }[]
  links?: TtlLink[]
  login?: TtlLink
  cta?: TtlLink
}

export type TtlConcept = { id: string; name: string; kind: string; mastery: number }

export type TtlActivity = { id: string; date: string; text: string; concept: string; score: number; status: "Consolidated" | "Inquiry" | "Verified" }

export type TtlTransfer = { from: string; to: string; explanation: string; memo: string }

export type TtlStat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number }

export type TtlFeature = { title: string; text: string }

export type TtlCoverageItem = { title: string; text: string }

export type TtlFaq = { q: string; a: string }

export type TtlResource = { title: string; tag: string; image?: string; href?: string }

export type TtlPalette = {
  page: string
  paper: string
  ink: string
  muted: string
  rule: string
  deep: string
  deepInk: string
  deepMuted: string
  gold: string
  lilac: string
  lilacInk: string
  accent: string
  accentInk: string
  good: string
  chart: [string, string, string]
  glow: [string, string, string]
}

const PALETTES = {
  teal: {
    page: "#f5f4ee",
    paper: "#ffffff",
    ink: "#10292d",
    muted: "#66726f",
    rule: "#e2e0d6",
    deep: "#0c2f35",
    deepInk: "#eef2ec",
    deepMuted: "#93aaa6",
    gold: "#8c7b33",
    lilac: "#cdc8f6",
    lilacInk: "#1e1a44",
    accent: "#0f3238",
    accentInk: "#ffffff",
    good: "#2f7d57",
    chart: ["#0f3238", "#a8963f", "#a9a2ee"] as [string, string, string],
    glow: ["#c9c3f5", "#f2c4b4", "#f7dccb"] as [string, string, string],
  },
  darkTeal: {
    page: "#070d0f",
    paper: "#0e181b",
    ink: "#ecf3f2",
    muted: "#859794",
    rule: "#1c2b2f",
    deep: "#040809",
    deepInk: "#e2ecea",
    deepMuted: "#6b7d7a",
    gold: "#d4a743",
    lilac: "#1e293b",
    lilacInk: "#9ebbe6",
    accent: "#182c31",
    accentInk: "#ffffff",
    good: "#3ba776",
    chart: ["#3ba776", "#d4a743", "#76a6e8"] as [string, string, string],
    glow: ["#162d33", "#2c2a1c", "#172338"] as [string, string, string],
  },
}

const DEFAULT_STATS: TtlStat[] = [
  { value: 4.8, suffix: "x", decimals: 1, label: "Measured conceptual retention factor" },
  { value: 94.2, suffix: "%", decimals: 1, label: "Average post-Feynman final exam score" },
  { value: 14200, suffix: "+", label: "Core syllabi and textbooks synthesized" },
]

const DEFAULT_FEATURES: TtlFeature[] = [
  {
    title: "Instant Syllabus Ingestion & Concept Extraction",
    text: "Drop any textbook chapter, syllabus, or lecture PDF. Our 120B Teacher Agent parses the structural ontology in seconds, isolating foundational axioms and formulating a strict, cold baseline exam without human authoring bias.",
  },
  {
    title: "Isolated Child AI & Live Socratic Dialogue",
    text: "Meet an intelligent Child AI with zero prior knowledge of your document. Speak or write your explanations in plain terms. As the Child questions your reasoning, you pinpoint gaps in your own understanding before any high-stakes exam.",
  },
  {
    title: "Empirical TES Scoring & Verification Analytics",
    text: "Watch the Child Agent sit for a blind final exam written and graded by the Teacher Agent. Your Teaching Efficiency Score (TES = ΔScore × Coverage) gives you an indisputable mathematical guarantee that you have achieved true conceptual mastery.",
  },
]

const DEFAULT_COVERAGE: TtlCoverageItem[] = [
  { title: "Air-Gapped Isolation", text: "Child Agent has zero document access" },
  { title: "Cold Baseline Exam", text: "Blind pre-test establishes true floor" },
  { title: "Socratic Scaffolding", text: "Pushes past memorized jargon" },
  { title: "TES Proof Metric", text: "Mathematical validation of retention" },
]

const DEFAULT_FAQ: TtlFaq[] = [
  {
    q: "How does the Feynman Technique work inside Study Buddy?",
    a: "Nobel laureate Richard Feynman observed that true understanding means being able to explain a complex topic in simple, intuitive language without hiding behind buzzwords. In Study Buddy, you explain concepts to an AI Child Agent that starts with zero knowledge of your material. If the Child Agent can pass a difficult exam based only on what you taught it, you have proven mastery.",
  },
  {
    q: "Why do you use two separate AI models (Teacher vs. Child)?",
    a: "To eliminate hallucination and cheating. The Teacher Agent (a flagship 120B model) holds the complete ground-truth syllabus, formulates rigorous multi-sentence conceptual exams, and grades responses. The Child Agent (a 20B lightweight model) is strictly air-gapped with zero access to your PDF. It learns solely from your explanations.",
  },
  {
    q: "What is the Teaching Efficiency Score (TES)?",
    a: "TES is a mathematical index defined as: TES = (Final Exam Score - Cold Baseline Score) × Concept Coverage. A high TES proves that your teaching actively transferred conceptual understanding to the Child Agent rather than relying on prior training data.",
  },
  {
    q: "What happens during the Cold Baseline Examination?",
    a: "Before you teach a single word, the Child Agent takes an automated baseline test formulated by the Teacher Agent. Because the Child has not been taught your material yet, it establishes a true baseline score (typically 5%–15%), proving that subsequent improvement is 100% attributable to your instruction.",
  },
  {
    q: "Do I need to install Ollama or run heavy models on my laptop?",
    a: "No! All inference runs in the cloud on Groq LPU acceleration. Response times are ultra-fast (~1.2 seconds for full exam grading), and the app works on any modern web browser without downloading gigabytes of model weights.",
  },
  {
    q: "Can I use voice to teach instead of typing?",
    a: "Yes! Study Buddy integrates Groq Whisper speech-to-text. Simply tap the microphone button in the dialogue chamber and speak naturally as if you were explaining the concept to a curious colleague or younger student.",
  },
  {
    q: "What document formats are supported for upload?",
    a: "You can upload course PDFs, lecture presentation slides, Markdown notes, research preprints, or textbook chapters. The Teacher Agent extracts text, builds the concept hierarchy, and structures the session automatically.",
  },
  {
    q: "Can I export an official certification or session transcript?",
    a: "Yes. Once the final examination and TES calculation are complete, you can download a formatted executive PDF report showing your baseline score, final score, question-by-question breakdown, and TES certificate.",
  },
]

const DEFAULT_RESOURCES: TtlResource[] = [
  {
    title: "The Neurobiology of Active Teaching: Why Richard Feynman was right",
    tag: "Research Paper",
    image: "/resources/neurobiology-feynman.jpg",
  },
  {
    title: "Dual-Agent Cognitive Isolation: Preventing Information Leakage in AI Tutors",
    tag: "Architecture",
    image: "/resources/cognitive-isolation.jpg",
  },
  {
    title: "The Mathematical Derivation of Teaching Efficiency Score (TES)",
    tag: "Whitepaper",
    image: "/resources/tes-mathematics.jpg",
  },
  {
    title: "From Passive Highlighting to Synaptic Recall: A 30-Day Comparative Trial",
    tag: "Clinical Data",
    image: "/resources/synaptic-recall.svg",
  },
]

const DEFAULT_FOOTER_COLUMNS: { title: string; links: TtlLink[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Feynman Studio", href: "#features" },
      { label: "Dual-Agent Engine", href: "#features" },
      { label: "Cold Baseline Exam", href: "#features" },
      { label: "TES Analytics", href: "#features" },
    ],
  },
  {
    title: "Methodology",
    links: [
      { label: "Socratic Questioning", href: "#benefits" },
      { label: "Cognitive Isolation", href: "#coverage" },
      { label: "Bloom's Taxonomy", href: "#operating" },
      { label: "Spaced Retention", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research Whitepapers", href: "#resources" },
      { label: "Documentation", href: "#faq" },
      { label: "API Reference", href: "#faq" },
      { label: "System Health", href: "#top" },
    ],
  },
  {
    title: "Academic",
    links: [
      { label: "University Pilots", href: "#faq" },
      { label: "Professor Portal", href: "#faq" },
      { label: "Cognitive Science Lab", href: "#resources" },
      { label: "Student Grants", href: "#get-started" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "#login" },
      { label: "Create Account", href: "#get-started" },
      { label: "My Learning Hub", href: "#dashboard" },
      { label: "Security & Privacy", href: "#coverage" },
    ],
  },
]

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}

function easeOutCubic(t: number) {
  const c = clamp(t, 0, 1)
  return 1 - Math.pow(1 - c, 3)
}

function formatPercent(n: number, decimals = 1) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + "%"
}

function formatStat(s: TtlStat, v: number) {
  const d = s.decimals ?? 0
  return (s.prefix ?? "") + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) + (s.suffix ?? "")
}

function markedWords(text: string) {
  const out: { word: string; mark: boolean; br: boolean; glue: boolean; tail: string }[] = []
  let trail = false
  text.split("*").forEach((part, i) => {
    const lead = /^\S/.test(part)
    part.split("\n").forEach((line, j) => {
      if (j > 0 && out.length) out[out.length - 1].br = true
      line.split(/[ \t]+/).forEach((w, k) => {
        if (!w) return
        if (i > 0 && j === 0 && k === 0 && lead && trail && out.length) out[out.length - 1].glue = true
        out.push({ word: w, mark: i % 2 === 1, br: false, glue: false, tail: "" })
      })
    })
    if (part) trail = /\S$/.test(part)
  })
  for (let k = 0; k < out.length - 1; k++) {
    const m = out[k].glue && !out[k].tail ? out[k + 1].word.match(/^[\u2014\u2013]+/) : null
    if (!m) continue
    out[k].tail = m[0]
    out[k + 1].word = out[k + 1].word.slice(m[0].length)
    if (!out[k + 1].word) {
      out[k].glue = out[k + 1].glue
      out[k].br = out[k + 1].br
      out.splice(k + 1, 1)
    }
  }
  return out
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())
}

const useIso = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

function useReduced() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

function useTween(target: number[], reduced: boolean, ms = 760) {
  const [v, setV] = React.useState(target)
  const cur = React.useRef(target)
  const key = target.join(",")
  React.useEffect(() => {
    const from = cur.current
    if (reduced || from.length !== target.length) {
      cur.current = target
      setV(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = easeOutCubic((now - t0) / ms)
      const next = target.map((t, i) => from[i] + (t - from[i]) * k)
      cur.current = next
      setV(next)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [key, reduced, ms])
  return v
}

function useSeen(ref: { current: Element | null }, margin = "0px 0px -12% 0px") {
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setSeen(true), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, margin])
  return seen
}

function Icon({ d, size = 16, stroke = 1.6, className }: { d: string; size?: number; stroke?: number; className?: string }) {
  return (
    <svg className={"ttl-svg " + (className ?? "")} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const I = {
  check: "M5 12.5l4.2 4.2L19 7",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z",
  shield: "M12 3l7 3v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z M9 12l2 2 4-4",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  swap: "M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  sparkles: "M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3z",
  cpu: "M4 4h16v16H4zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3",
}

function BrainMark({ size = 22 }: { size?: number }) {
  return (
    <svg className="ttl-svg" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="var(--ttl-accent)" />
      <path d="M10 9c0-1.7 1.3-3 3-3 .6 0 1.2.2 1.7.5.5-.3 1.1-.5 1.7-.5 1.7 0 3 1.3 3 3 0 .4-.1.8-.2 1.1 1.4.5 2.4 1.8 2.4 3.4 0 1.4-.8 2.6-2 3.1.1.4.1.7.1 1.1 0 2.2-1.8 4-4 4-.6 0-1.2-.1-1.7-.4-.5.3-1.1.4-1.7.4-2.2 0-4-1.8-4-4 0-.4 0-.7.1-1.1-1.2-.5-2-1.7-2-3.1 0-1.6 1-2.9 2.4-3.4-.1-.3-.2-.7-.2-1.1z" fill="none" stroke="var(--ttl-page)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="15" r="2.2" fill="var(--ttl-gold)" />
      <line x1="16" y1="10" x2="16" y2="20" stroke="var(--ttl-gold)" strokeWidth="1.4" strokeDasharray="1.5 2" />
    </svg>
  )
}

function Marked({ text, wordClass }: { text: string; wordClass?: string }) {
  const words = markedWords(text)
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className={(wordClass ?? "") + (w.mark ? " ttl-gold" : "")}>{w.word}</span>
          {w.tail ? <span className={wordClass}>{w.tail}</span> : null}
          {w.br ? <br /> : w.glue || i === words.length - 1 ? null : " "}
        </React.Fragment>
      ))}
    </>
  )
}

function Nav({
  brand,
  logo,
  nav,
  go,
  scrolled,
  isAuthenticated,
  user,
  onOpenAuth,
  onGoToDashboard,
  onStart,
}: {
  brand: string
  logo?: React.ReactNode
  nav: TtlNav
  go: (href?: string) => (e: React.MouseEvent) => void
  scrolled: boolean
  isAuthenticated: boolean
  user: any
  onOpenAuth: (mode?: 'login' | 'register') => void
  onGoToDashboard: () => void
  onStart: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [sheet, setSheet] = React.useState(false)
  const boxRef = React.useRef(null as HTMLDivElement | null)

  React.useEffect(() => {
    if (!open && !sheet) return
    const away = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSheet(false)
      }
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        setSheet(false)
      }
    }
    document.addEventListener("pointerdown", away)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("pointerdown", away)
      document.removeEventListener("keydown", esc)
    }
  }, [open, sheet])

  const close = (href?: string) => (e: React.MouseEvent) => {
    setOpen(false)
    setSheet(false)
    go(href)(e)
  }

  const products = nav.products ?? []

  return (
    <header className="ttl-nav" data-scrolled={scrolled || undefined}>
      <div className="ttl-nav-in" ref={boxRef}>
        <a href="#" className="ttl-brand" onClick={close("#top")}>
          {logo ?? <BrainMark />}
          <span>{brand}</span>
        </a>
        <nav className="ttl-nav-links" aria-label="Primary">
          {products.length ? (
            <div className="ttl-prod" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <button type="button" className="ttl-nav-link" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                How It Works <Icon d={I.down} size={13} className="ttl-caret" />
              </button>
              <div className="ttl-prod-panel" data-open={open || undefined}>
                {products.map((p, i) => (
                  <a key={p.label} href={p.href ?? "#"} className="ttl-prod-item" onClick={close(p.href)} tabIndex={open ? 0 : -1}>
                    <span className="ttl-prod-ic">
                      <Icon d={[I.brain, I.shield, I.sparkles][i % 3]} size={17} />
                    </span>
                    <span>
                      <b>{p.label}</b>
                      <small>{p.text}</small>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {(nav.links ?? []).map((l) => (
            <a key={l.label} href={l.href ?? "#"} className="ttl-nav-link" onClick={close(l.href)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ttl-nav-end">
          <ThemeToggle />
          <div className="ttl-nav-sep" />
          {isAuthenticated ? (
            <button
              type="button"
              className="ttl-btn ttl-btn-lilac ttl-btn-sm"
              onClick={onGoToDashboard}
            >
              Dashboard ({user?.name?.split(" ")[0] || "Student"})
            </button>
          ) : (
            <>
              <button
                type="button"
                className="ttl-nav-link ttl-hide-sm"
                onClick={() => onOpenAuth('login')}
              >
                Sign in
              </button>
              <button
                type="button"
                className="ttl-btn ttl-btn-dark ttl-btn-sm"
                onClick={onStart}
              >
                Launch Studio
              </button>
            </>
          )}
          <button type="button" className="ttl-burger" aria-label={sheet ? "Close menu" : "Open menu"} aria-expanded={sheet} onClick={() => setSheet((s) => !s)}>
            <Icon d={sheet ? I.close : I.menu} size={18} />
          </button>
        </div>
        <div className="ttl-sheet" data-open={sheet || undefined}>
          {[...products.map((p) => ({ label: p.label, href: p.href })), ...(nav.links ?? [])].map((l) => (
            <a key={l.label} href={l.href ?? "#"} onClick={close(l.href)} tabIndex={sheet ? 0 : -1}>
              {l.label}
              <Icon d={I.arrow} size={15} />
            </a>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              className="ttl-btn ttl-btn-lilac w-full mt-2"
              onClick={() => {
                setSheet(false)
                onGoToDashboard()
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              type="button"
              className="ttl-btn ttl-btn-dark w-full mt-2"
              onClick={() => {
                setSheet(false)
                onOpenAuth('login')
              }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
      <span className="ttl-progress" aria-hidden="true" />
    </header>
  )
}

const SETUP_ITEMS = [
  "Teacher Agent parses course ontology",
  "Extracting 8 core conceptual axioms",
  "Formulating cold baseline exam questions",
  "Air-gapping Child Agent neural buffer"
]

function SceneSetup({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [done, setDone] = React.useState(reduced ? SETUP_ITEMS.length : 0)
  const [run, setRun] = React.useState(0)
  const [off, setOff] = React.useState([] as number[])

  React.useEffect(() => {
    if (!active) return
    if (reduced) {
      setDone(SETUP_ITEMS.length)
      return
    }
    setDone(0)
    setOff([])
    const ts = SETUP_ITEMS.map((_, i) => setTimeout(() => setDone(i + 1), 520 + i * 560))
    return () => ts.forEach(clearTimeout)
  }, [active, run, reduced])

  const ready = SETUP_ITEMS.filter((_, i) => i < done && !off.includes(i)).length

  return (
    <div className="ttl-scene ttl-scene-setup">
      <div className="ttl-setup-card">
        <div className="ttl-setup-head">
          <span>
            <b>Course Setup & Decomposition</b>
            <small>Advanced Quantum Mechanics • PHYS 401</small>
          </span>
          <button type="button" className="ttl-btn ttl-btn-dark ttl-btn-sm" onClick={() => setRun((r) => r + 1)}>
            Re-parse <Icon d={I.plus} size={14} />
          </button>
        </div>
        <ul className="ttl-setup-list">
          {SETUP_ITEMS.map((t, i) => {
            const on = i < done && !off.includes(i)
            return (
              <li key={t}>
                <button type="button" data-on={on || undefined} data-last={i === SETUP_ITEMS.length - 1 || undefined} onClick={() => (i < done ? setOff((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i])) : setDone(i + 1))}>
                  <span className="ttl-setup-ic">{i === 0 ? <Icon d={I.doc} size={15} /> : i === 1 ? <Icon d={I.brain} size={15} /> : i === 2 ? <Icon d={I.sparkles} size={15} /> : <Icon d={I.shield} size={15} />}</span>
                  {t}
                  <span className="ttl-tick">
                    <Icon d={I.check} size={13} stroke={2.4} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="ttl-setup-foot">
          <span>
            {ready} of {SETUP_ITEMS.length} ready
          </span>
          <span className="ttl-meter">
            <i style={{ width: (ready / SETUP_ITEMS.length) * 100 + "%" }} />
          </span>
          <span>{ready === SETUP_ITEMS.length ? "3.2s on Groq" : "Parsing…"}</span>
        </div>
        <svg className="ttl-svg ttl-cursor" data-at={done >= SETUP_ITEMS.length - 1 ? "last" : undefined} data-click={done >= SETUP_ITEMS.length || undefined} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 3l14 7.5-6.2 1.6L10 18.5z" fill="var(--ttl-ink)" stroke="var(--ttl-paper)" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function ScenePhone({ active }: { active: boolean }) {
  const [sheet, setSheet] = React.useState(false)
  const [amt, setAmt] = React.useState(3)
  const [state, setState] = React.useState("idle" as "idle" | "sending" | "sent")

  React.useEffect(() => {
    if (!active) setSheet(false)
  }, [active])

  const send = () => {
    setState("sending")
    setTimeout(() => setState("sent"), 900)
  }

  const complexityLevels = ["Intuitive Analogy (ELIF5)", "First-Principles Conceptual", "Mathematical Formalism", "Doctoral Edge Cases"]

  return (
    <div className="ttl-scene ttl-scene-phone">
      <span className="ttl-bokeh" aria-hidden="true" />
      <div className="ttl-chipfloat ttl-chipfloat-a" aria-hidden="true">
        <Icon d={I.check} size={12} stroke={2.4} /> Voice Transcribed · Groq Whisper
      </div>
      <div className="ttl-chipfloat ttl-chipfloat-b" aria-hidden="true">
        Neural Insight Consolidated ✓
      </div>
      <div className="ttl-phone">
        <div className="ttl-phone-screen">
          <div className="ttl-phone-status">
            <span>Child AI Dialogue</span>
            <i />
          </div>
          <div className="ttl-phone-k">Cognitive Ingestion Level</div>
          <div className="ttl-phone-bal">Level {amt}</div>
          <svg className="ttl-svg ttl-phone-chart" viewBox="0 0 180 48" width="180" height="48" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 40 C20 36 28 30 44 31 S70 18 88 22 118 8 136 12 164 4 180 6" fill="none" stroke="var(--ttl-gold)" strokeWidth="1.8" />
          </svg>
          <div className="ttl-phone-card">
            <span>Child Agent Query</span>
            <b>"Wait, if light is a wave, how does it knock electrons off metal in photoelectric effect?"</b>
          </div>
          <button type="button" className="ttl-phone-btn" onClick={() => setSheet(true)}>
            {state === "sent" ? "Explanation Transmitted ✓" : "Speak / Transmit Explanation"}
          </button>
          <div className="ttl-phone-sheet" data-open={sheet || undefined}>
            <div className="ttl-phone-grip" />
            {state === "sent" ? (
              <div className="ttl-phone-sent">
                <span className="ttl-done-ic">
                  <Icon d={I.check} size={16} stroke={2.4} />
                </span>
                <b>Explanation Consolidated</b>
                <small>Child Agent memory buffer reinforced</small>
                <button type="button" onClick={() => setSheet(false)}>
                  Continue Dialogue
                </button>
              </div>
            ) : (
              <>
                <b>Select Explanation Rigor</b>
                <div className="ttl-phone-amt">{complexityLevels[amt - 1] || "Intuitive"}</div>
                <input type="range" min={1} max={4} value={amt} onChange={(e) => setAmt(+e.target.value)} aria-label="Complexity tier" className="ttl-range" style={{ "--ttl-fill": ((amt - 1) / 3) * 100 + "%" } as React.CSSProperties} tabIndex={sheet ? 0 : -1} />
                <button type="button" onClick={send} disabled={state === "sending"} tabIndex={sheet ? 0 : -1}>
                  {state === "sending" ? "Transmitting to Child Buffer…" : "Confirm Verbal Explanation"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TAXONOMY_PARTS = [
  { name: "Intuitive Analogies", share: 0.42 },
  { name: "First Principles", share: 0.38 },
  { name: "Boundary Resilience", share: 0.20 },
]

function SceneReport({ active, colors, reduced }: { active: boolean; colors: string[]; reduced: boolean }) {
  const parts = TAXONOMY_PARTS
  const target = parts.map((p) => (active ? p.share * 100 : 0))
  const w = useTween(target, reduced, 1000)
  const t = useTween([active ? 89.6 : 0], reduced, 1400)
  const pct = [42, 38, 20]

  return (
    <div className="ttl-scene ttl-scene-report">
      <div className="ttl-rep-card ttl-rep-back" aria-hidden="true" />
      <div className="ttl-rep-card">
        <div className="ttl-rep-head">
          <b>Session Analytics</b>
          <div className="ttl-seg">
            <button type="button" aria-selected="true">
              Verified TES
            </button>
          </div>
        </div>
        <div className="ttl-k">Calculated Teaching Efficiency Score</div>
        <div className="ttl-rep-total">{formatPercent(t[0])}</div>
        <div className="ttl-rep-row">
          <div>
            <span>Cold Baseline</span>
            <b>14.0%</b>
          </div>
          <div>
            <span>Final Blind Exam</span>
            <b>92.5%</b>
          </div>
          <div>
            <span>Net Delta (ΔTES)</span>
            <b style={{ color: "var(--ttl-good)" }}>+78.5%</b>
          </div>
        </div>
        <div className="ttl-break-head">
          <b>Bloom's Cognitive Spectrum Breakdown</b>
          <span>Empirically verified across 8 conceptual modules</span>
        </div>
        <div className="ttl-bar ttl-bar-lg">
          {parts.map((p, i) => (
            <span key={p.name} style={{ width: w[i] + "%", background: colors[i % colors.length] }} />
          ))}
        </div>
        <div className="ttl-legend">
          {parts.map((p, i) => (
            <span key={p.name}>
              <i style={{ background: colors[i % colors.length] }} />
              {pct[i]}% {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Scene({ i, active, reduced, colors }: { i: number; active: boolean; reduced: boolean; colors: string[] }) {
  const k = i % 3
  if (k === 0) return <SceneSetup active={active} reduced={reduced} />
  if (k === 1) return <ScenePhone active={active} />
  return <SceneReport active={active} colors={colors} reduced={reduced} />
}

const DOTS = 500

function Coverage({ title, items, reduced }: { title: string; items: TtlCoverageItem[]; reduced: boolean }) {
  const min = 10
  const max = 500
  const [conceptsCount, setConceptsCount] = React.useState(85)
  const ref = React.useRef(null as HTMLDivElement | null)
  const seen = useSeen(ref)

  const lit = Math.round((conceptsCount / max) * DOTS)
  const pos = (conceptsCount - min) / (max - min)
  const shown = useTween([seen ? conceptsCount : 0, seen ? Math.round(conceptsCount * 0.94) : 0, seen ? Math.round(180 + conceptsCount * 0.4) : 0], reduced, 700)

  return (
    <section className="ttl-sec ttl-cov" data-sec="coverage">
      <div className="ttl-wrap">
        <h2 className="ttl-h2 ttl-cov-title" data-ttl-rise>
          <Marked text={title} />
        </h2>
        <div className="ttl-cov-items">
          {items.map((it, i) => (
            <div key={it.title} className="ttl-cov-item" data-ttl-rise>
              <span className="ttl-cov-ic">
                <Icon d={[I.shield, I.doc, I.brain, I.sparkles][i % 4]} size={20} stroke={1.4} />
              </span>
              <b>{it.title}</b>
              <small>{it.text}</small>
            </div>
          ))}
        </div>
        <div className="ttl-cov-calc" ref={ref} data-ttl-rise>
          <div className="ttl-cov-ctl">
            <div className="ttl-k">Syllabus Scale (Concept Nodes)</div>
            <div className="ttl-cov-dep">{Math.round(shown[0])} Concepts</div>
            <input
              type="range"
              className="ttl-range ttl-range-lg"
              min={min}
              max={max}
              value={conceptsCount}
              onChange={(e) => setConceptsCount(+e.target.value)}
              aria-label="Concepts scale"
              style={{ "--ttl-fill": pos * 100 + "%" } as React.CSSProperties}
            />
            <div className="ttl-cov-scale">
              <span>{min} Concepts (Single Lecture)</span>
              <span>{max} Concepts (Complete Textbook)</span>
            </div>
            <dl className="ttl-cov-out">
              <div>
                <dt>Grounded Synapses</dt>
                <dd>{Math.round(shown[0]) * 12}</dd>
              </div>
              <div>
                <dt>Mastery Verified</dt>
                <dd>{Math.round(shown[1])}</dd>
              </div>
              <div data-over="true">
                <dt>Retention Half-Life</dt>
                <dd>{Math.round(shown[2])} Days</dd>
              </div>
            </dl>
            <p className="ttl-fine">
              Every concept node undergoes dual-agent Socratic interrogation. Unlike passive flashcards, knowledge is permanently consolidated into semantic memory structures.
            </p>
          </div>
          <div className="ttl-dots-wrap">
            <div className="ttl-dots" role="img" aria-label={lit + " of " + DOTS + " neural synapses illuminated"}>
              {Array.from({ length: DOTS }, (_, i) => (
                <i key={i} data-on={i < lit || undefined} style={{ transitionDelay: reduced ? "0ms" : Math.min(i, 400) * 1.4 + "ms" }} />
              ))}
            </div>
            <p className="ttl-fine">
              Each dot represents one verified neural synapse. The 500-synapse active recall matrix guarantees zero conceptual blind spots.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingComparison({ reduced }: { reduced: boolean }) {
  const [studyWeeks, setStudyWeeks] = React.useState(6)
  const passiveHours = studyWeeks * 14
  const feynmanHours = studyWeeks * 4
  const bars = useTween([passiveHours, feynmanHours], reduced, 600)
  const top = Math.max(passiveHours, feynmanHours, 1)

  return (
    <section className="ttl-sec ttl-price" data-sec="pricing">
      <span className="ttl-price-glow" aria-hidden="true" />
      <div className="ttl-wrap ttl-split">
        <div className="ttl-label">Cognitive Architecture</div>
        <div>
          <h2 className="ttl-price-big" data-ttl-rise>
            <span>Zero</span> cognitive drift.
          </h2>
          <p className="ttl-price-intro" data-ttl-rise>
            Why conventional cramming fails in technical courses compared to active Feynman synthesis:
          </p>
          <ul className="ttl-price-list">
            <li data-ttl-rise>
              <svg className="ttl-svg ttl-price-check" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d={I.check} />
              </svg>
              Dual-Agent Isolation: Zero document leakage between Teacher (120B) and Child (20B)
            </li>
            <li data-ttl-rise>
              <svg className="ttl-svg ttl-price-check" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d={I.check} />
              </svg>
              Sub-second cloud reasoning powered by Groq LPU acceleration
            </li>
            <li data-ttl-rise>
              <svg className="ttl-svg ttl-price-check" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d={I.check} />
              </svg>
              Persistent session history & neural mastery analytics stored on Supabase PostgreSQL
            </li>
          </ul>

          <div className="ttl-compare" data-ttl-rise>
            <div className="ttl-compare-head">
              <span>Exam Prep Duration (Weeks)</span>
              <div className="ttl-step">
                <button type="button" onClick={() => setStudyWeeks((v) => Math.max(1, v - 1))} aria-label="Fewer weeks">
                  −
                </button>
                <output aria-live="polite">{studyWeeks}</output>
                <button type="button" onClick={() => setStudyWeeks((v) => Math.min(16, v + 1))} aria-label="More weeks">
                  +
                </button>
              </div>
            </div>
            <div className="ttl-cbar">
              <span>Passive Cramming</span>
              <i style={{ width: (bars[0] / top) * 100 + "%" }} />
              <b>{Math.round(bars[0])} hrs · 78% forgotten</b>
            </div>
            <div className="ttl-cbar ttl-cbar-us">
              <span>Neural Feynman</span>
              <i style={{ width: (bars[1] / top) * 100 + "%" }} />
              <b>{Math.round(bars[1])} hrs · 94% retained</b>
            </div>
            <p className="ttl-fine">
              Data derived from Ebbinghaus spaced retention studies: Teaching a naive agent compresses study time by 3.5× while doubling 180-day conceptual retention.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq({ f }: { f: { label?: string; title?: string; items?: TtlFaq[]; contact?: string } }) {
  const [open, setOpen] = React.useState(-1)
  const items = f.items ?? DEFAULT_FAQ
  const contact = f.contact ?? "research@studybuddy.ai"

  return (
    <section className="ttl-sec ttl-faq" data-sec="faq">
      <div className="ttl-wrap ttl-split">
        <div className="ttl-label">{f.label ?? "FAQ"}</div>
        <div>
          <h2 className="ttl-h2 ttl-faq-title" data-ttl-rise>
            <Marked text={f.title ?? "Frequently Asked\nQuestions"} />
          </h2>
          <ul className="ttl-faq-list">
            {items.map((it, i) => (
              <li key={it.q} data-ttl-rise>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen((o) => (o === i ? -1 : i))}>
                  <span>{it.q}</span>
                  <span className="ttl-plus" data-open={open === i || undefined}>
                    <Icon d={I.plus} size={16} />
                  </span>
                </button>
                <div className="ttl-collapse" data-open={open === i || undefined}>
                  <div>
                    <p>{it.a}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {contact ? (
            <p className="ttl-fine ttl-faq-more">
              Have deeper pedagogical inquiries? Contact our team at <a href={"mailto:" + contact}>{contact}</a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function Cta({
  brand,
  openSignal,
  reduced,
  onStart,
}: {
  brand: string
  openSignal: number
  reduced: boolean
  onStart: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState("idle" as "idle" | "sending" | "done" | "invalid")
  const inputRef = React.useRef(null as HTMLInputElement | null)
  const cardRef = React.useRef(null as HTMLDivElement | null)

  React.useEffect(() => {
    if (!openSignal) return
    setOpen(true)
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), reduced ? 0 : 650)
    return () => clearTimeout(t)
  }, [openSignal, reduced])

  React.useEffect(() => {
    const card = cardRef.current
    if (!card || reduced) return
    const blobs = Array.from(card.querySelectorAll(".ttl-blob")) as HTMLElement[]
    const movers = blobs.map((b, i) => ({
      x: gsap.quickTo(b, "x", { duration: 1.4 + i * 0.5, ease: "power3.out" }),
      y: gsap.quickTo(b, "y", { duration: 1.4 + i * 0.5, ease: "power3.out" }),
    }))
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect()
      const dx = e.clientX - r.left - r.width / 2
      const dy = e.clientY - r.top - r.height / 2
      movers.forEach((m, i) => {
        const k = [0.35, -0.25, 0.18][i] ?? 0.2
        m.x(dx * k)
        m.y(dy * k)
      })
    }
    card.addEventListener("pointermove", move)
    return () => {
      card.removeEventListener("pointermove", move)
      blobs.forEach((b) => gsap.killTweensOf(b))
    }
  }, [reduced])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!open) {
      setOpen(true)
      setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 420)
      return
    }
    if (!isEmail(email)) {
      setState("invalid")
      inputRef.current?.focus()
      return
    }
    setState("sending")
    setTimeout(() => {
      setState("done")
      onStart()
    }, 700)
  }

  return (
    <section className="ttl-sec ttl-cta-sec" data-sec="get-started">
      <div className="ttl-wrap">
        <div className="ttl-cta" ref={cardRef}>
          <span className="ttl-blob ttl-blob-a" aria-hidden="true" />
          <span className="ttl-blob ttl-blob-b" aria-hidden="true" />
          <span className="ttl-blob ttl-blob-c" aria-hidden="true" />
          <span className="ttl-grain" aria-hidden="true" />
          <div className="ttl-cta-in">
            <h2 className="ttl-h2">
              <Marked text={"Ready to experience\n*" + brand + " Neural*?"} />
            </h2>
            <p>
              Launch your first Feynman learning session in sixty seconds. Upload course notes, teach your isolated Child AI, and prove your true understanding.
            </p>
            {state === "done" ? (
              <div className="ttl-cta-done" role="status">
                <span className="ttl-done-ic">
                  <Icon d={I.check} size={16} stroke={2.4} />
                </span>
                Launching workspace for {email.trim()}…
              </div>
            ) : (
              <form className="ttl-cta-row" onSubmit={submit} noValidate>
                <div className="ttl-morph" data-open={open || undefined} data-bad={state === "invalid" || undefined}>
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state !== "sending") setState("idle")
                    }}
                    tabIndex={open ? 0 : -1}
                    aria-label="Student email"
                  />
                  <button type="submit" disabled={state === "sending"}>
                    <span className="ttl-morph-label">Get Started</span>
                    <span className="ttl-morph-go">{state === "sending" ? <span className="ttl-spin" /> : <Icon d={I.arrow} size={16} />}</span>
                  </button>
                </div>
                <button type="button" className="ttl-btn ttl-btn-glass" onClick={onStart}>
                  Direct Workspace Launch
                </button>
              </form>
            )}
            {state === "invalid" ? (
              <p className="ttl-err" role="alert">
                Please enter a valid student email address.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function Dial() {
  const ticks = Array.from({ length: 72 }, (_, i) => i)
  return (
    <svg className="ttl-svg ttl-dial" viewBox="0 0 320 320" width="320" height="320" aria-hidden="true">
      <circle cx="160" cy="160" r="152" fill="none" stroke="var(--ttl-deep-muted)" strokeOpacity="0.35" />
      <g className="ttl-dial-ticks">
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2
          const long = i % 6 === 0
          const r1 = long ? 128 : 136
          return <line key={i} x1={160 + Math.cos(a) * r1} y1={160 + Math.sin(a) * r1} x2={160 + Math.cos(a) * 146} y2={160 + Math.sin(a) * 146} stroke="var(--ttl-deep-ink)" strokeOpacity={long ? 0.7 : 0.3} strokeWidth={long ? 1.6 : 1} />
        })}
      </g>
      <g className="ttl-dial-ring">
        <circle cx="160" cy="160" r="112" fill="none" stroke="var(--ttl-deep-muted)" strokeOpacity="0.4" strokeDasharray="2 6" />
        <circle cx="160" cy="48" r="5" fill="var(--ttl-gold)" />
        <circle cx="272" cy="160" r="3" fill="var(--ttl-deep-ink)" />
      </g>
      <circle cx="160" cy="160" r="88" fill="none" stroke="var(--ttl-deep-muted)" strokeOpacity="0.3" />
      <circle cx="160" cy="160" r="66" fill="var(--ttl-lilac)" />
      <circle cx="160" cy="160" r="44" fill="var(--ttl-deep)" fillOpacity="0.12" />
      <g transform="translate(136 134)" fill="none" stroke="var(--ttl-lilac-ink)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 44h40M8 44V22l16-12 16 12v22M18 44V32h12v12" />
        <circle cx="24" cy="22" r="3" fill="var(--ttl-gold)" stroke="none" />
      </g>
    </svg>
  )
}

function StatTile({ s, reduced }: { s: TtlStat; reduced: boolean }) {
  const ref = React.useRef(null as HTMLDivElement | null)
  const seen = useSeen(ref)
  const [v] = useTween([seen ? s.value : 0], reduced, 1600)
  return (
    <div className="ttl-stat" ref={ref}>
      <span className="ttl-stat-rule" aria-hidden="true" />
      <b aria-label={formatStat(s, s.value)}>{formatStat(s, s.decimals ? v : Math.round(v))}</b>
      <span>{s.label}</span>
    </div>
  )
}

interface LandingPageProps {
  onStart: () => void
  onOpenAuth: (mode?: 'login' | 'register') => void
  onGoToDashboard: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onOpenAuth,
  onGoToDashboard,
}) => {
  const { isAuthenticated, user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const pal = isDark ? PALETTES.darkTeal : PALETTES.teal
  const reduced = useReduced()
  const rootRef = React.useRef(null as HTMLDivElement | null)
  const sentinelRef = React.useRef(null as HTMLSpanElement | null)
  const [scrolled, setScrolled] = React.useState(false)
  const [feat, setFeat] = React.useState(0)
  const [ctaSignal, setCtaSignal] = React.useState(0)
  const alive = React.useRef(true)

  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const colors = [...pal.chart]

  const go = React.useCallback(
    (href?: string) => (e: React.MouseEvent) => {
      if (!href || !href.startsWith("#")) return
      const root = rootRef.current
      if (!root) return
      const id = href.slice(1)
      const el = id === "top" || id === "" ? root : (root.querySelector('[data-sec="' + id + '"]') as HTMLElement | null)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
      if (id === "get-started") setCtaSignal((s) => s + 1)
    },
    [reduced],
  )
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === "undefined") return
    const blocks = Array.from(root.querySelectorAll("[data-feat]")) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setFeat(+(e.target as HTMLElement).dataset.feat!)
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    blocks.forEach((b) => io.observe(b))
    return () => io.disconnect()
  }, [])

  useIso(() => {
    const root = rootRef.current
    if (!root) return
    gsap.registerPlugin(ScrollTrigger)
    const q = gsap.utils.selector(root)
    const one = (s: string) => q(s)[0] as Element | undefined
    const mm = gsap.matchMedia()

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 900px)" }, (ctx) => {
      const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean }
      if (!motion) return

      gsap.fromTo(q(".ttl-progress"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.3 } })

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } })
      intro
        .from(q(".ttl-hero-word"), { yPercent: 118, rotate: 3, duration: 1.15, stagger: 0.055 })
        .from(q(".ttl-hero-fade"), { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, "-=0.8")
        .from(q(".ttl-device-wrap"), { y: 140, autoAlpha: 0, duration: 1.3 }, "-=0.75")
        .from(q(".ttl-float"), { x: 70, autoAlpha: 0, duration: 1.1, stagger: 0.14 }, "-=0.9")

      const device = one(".ttl-device")
      if (device)
        gsap.fromTo(
          device,
          { rotateX: wide ? 24 : 12, scale: wide ? 0.9 : 0.96, y: wide ? -10 : 0 },
          { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: one(".ttl-device-wrap"), start: "top 96%", end: wide ? "top 18%" : "top 40%", scrub: 0.7 } },
        )

      if (wide)
        q(".ttl-float-in").forEach((el, i) =>
          gsap.to(el, { y: -70 - i * 60, rotate: i ? 2 : -2, ease: "none", scrollTrigger: { trigger: one(".ttl-hero"), start: "top top", end: "bottom top", scrub: true } }),
        )
      gsap.to(q(".ttl-hero-glow"), { yPercent: 30, scale: 1.25, ease: "none", scrollTrigger: { trigger: one(".ttl-hero"), start: "top top", end: "bottom top", scrub: true } })

      const words = q(".ttl-bword")
      if (words.length)
        gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: one(".ttl-benefits-text"), start: "top 82%", end: "bottom 48%", scrub: true } })
      gsap.fromTo(q(".ttl-stat-rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut", stagger: 0.12, scrollTrigger: { trigger: one(".ttl-stats"), start: "top 85%", once: true } })

      q(".ttl-stage, .ttl-feat-inline").forEach((el) =>
        gsap.fromTo(
          el,
          { clipPath: "inset(10% 8% 10% 8% round 36px)", scale: 0.96 },
          { clipPath: "inset(0% 0% 0% 0% round 14px)", scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 40%", scrub: 0.6 } },
        ),
      )

      const rise = q("[data-ttl-rise]")
      gsap.set(rise, { y: 34, autoAlpha: 0 })
      ScrollTrigger.batch(rise, {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.95, ease: "power3.out", stagger: 0.07, overwrite: true }),
      })
      gsap.fromTo(q(".ttl-price-check path"), { strokeDashoffset: 26 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: one(".ttl-price-list"), start: "top 80%", once: true } })

      const ctaCard = one(".ttl-cta")
      if (ctaCard)
        gsap.fromTo(ctaCard, { scale: 0.9, borderRadius: 44 }, { scale: 1, borderRadius: 10, ease: "none", scrollTrigger: { trigger: ctaCard, start: "top 98%", end: "top 45%", scrub: 0.6 } })
      const op = one(".ttl-op")
      if (op) {
        gsap.to(q(".ttl-dial-ticks"), { rotation: 140, svgOrigin: "160 160", ease: "none", scrollTrigger: { trigger: op, start: "top bottom", end: "bottom top", scrub: 0.5 } })
        gsap.to(q(".ttl-dial-ring"), { rotation: -220, svgOrigin: "160 160", ease: "none", scrollTrigger: { trigger: op, start: "top bottom", end: "bottom top", scrub: 0.8 } })
      }
      gsap.from(q(".ttl-res-card"), { y: 60, autoAlpha: 0, rotate: 1.5, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: one(".ttl-res-grid"), start: "top 85%", once: true } })

      const big = one(".ttl-bigmark")
      if (big) gsap.from(q(".ttl-bigmark span"), { yPercent: 105, ease: "none", stagger: 0.04, scrollTrigger: { trigger: big, start: "top bottom", end: "bottom bottom", scrub: 0.6 } })
    })

    let t = 0
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
      clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 160)
    }) : null
    ro?.observe(root)

    return () => {
      ro?.disconnect()
      clearTimeout(t)
      mm.revert()
    }
  }, [isDark])

  const style = {
    "--ttl-h": "100svh",
    "--ttl-page": pal.page,
    "--ttl-paper": pal.paper,
    "--ttl-ink": pal.ink,
    "--ttl-muted": pal.muted,
    "--ttl-rule": pal.rule,
    "--ttl-deep": pal.deep,
    "--ttl-deep-ink": pal.deepInk,
    "--ttl-deep-muted": pal.deepMuted,
    "--ttl-gold": pal.gold,
    "--ttl-lilac": pal.lilac,
    "--ttl-lilac-ink": pal.lilacInk,
    "--ttl-accent": pal.accent,
    "--ttl-accent-ink": pal.accentInk,
    "--ttl-good": pal.good,
    "--ttl-chart-c": pal.chart[2],
    "--ttl-glow-a": pal.glow[0],
    "--ttl-glow-b": pal.glow[1],
    "--ttl-glow-c": pal.glow[2],
  } as React.CSSProperties

  const heroTitle = "*Teach the AI.* True mastery\nrequires explanation"

  return (
    <div ref={rootRef} className="ttl-root" style={style} data-sec="top" data-dark={isDark || undefined}>
      <style>{TTL_CSS}</style>
      <span ref={sentinelRef} className="ttl-sentinel" aria-hidden="true" />
      
      <Nav
        brand="Study Buddy"
        logo={<BrainMark />}
        nav={{
          products: [
            { label: "Neural Feynman Engine", text: "Master topics by teaching an air-gapped 20B AI child agent.", href: "#features" },
            { label: "Cognitive Isolation Protocol", text: "Zero ground-truth leakage between Teacher (120B) and Child.", href: "#coverage" },
            { label: "Teaching Efficiency Score (TES)", text: "Mathematical quantification of retention and conceptual mastery.", href: "#benefits" },
          ],
          links: [
            { label: "Methodology", href: "#features" },
            { label: "Architecture", href: "#coverage" },
            { label: "Research", href: "#pricing" },
            { label: "Whitepapers", href: "#resources" },
            { label: "FAQ", href: "#faq" },
          ],
        }}
        go={go}
        scrolled={scrolled}
        isAuthenticated={isAuthenticated}
        user={user}
        onOpenAuth={onOpenAuth}
        onGoToDashboard={onGoToDashboard}
        onStart={onStart}
      />

      {/* Hero */}
      <section className="ttl-hero" data-sec="dashboard">
        <span className="ttl-hero-glow" aria-hidden="true" />
        <span className="ttl-hero-grid" aria-hidden="true" />
        <div className="ttl-wrap ttl-hero-head">
          <h1 className="ttl-h1">
            {markedWords(heroTitle).map((w, i, all) => (
              <React.Fragment key={i}>
                <span className="ttl-mask">
                  <span className="ttl-hero-word">
                    <span className={w.mark ? "ttl-gold" : undefined}>{w.word}</span>
                    {w.tail}
                  </span>
                </span>
                {w.br ? <br /> : w.glue || i === all.length - 1 ? null : " "}
              </React.Fragment>
            ))}
          </h1>
          <p className="ttl-hero-text ttl-hero-fade">
            Passive cramming creates an illusion of competence. Study Buddy pairs you with an isolated Child AI that knows nothing until you teach it—scored by an impartial 120B Teacher Agent.
          </p>
          <div className="ttl-hero-ctas ttl-hero-fade">
            <button
              type="button"
              className="ttl-btn ttl-btn-dark"
              onClick={onStart}
            >
              Launch Learning Session
            </button>
            <a
              className="ttl-btn ttl-btn-lilac"
              href="#features"
              onClick={go("#features")}
            >
              Explore Methodology
            </a>
          </div>
        </div>

        <div className="ttl-device-wrap">
          <div className="ttl-device">
            <div className="ttl-hero-showcase">
              <div className="ttl-hero-img-card">
                <img
                  src="/assets/hero-feynman-desk.jpg"
                  srcSet="/assets/hero-feynman-desk.jpg 1x, /assets/hero-feynman-desk@2x.jpg 2x"
                  alt="Learn smarter. Achieve more. Master concepts through the Feynman method — explain, understand, and never forget."
                  className="ttl-hero-img"
                  loading="eager"
                />
                <div className="ttl-hero-img-pill">
                  <span className="ttl-hero-pill-dot" />
                  <span>The Feynman Protocol • Explain Simply to Master</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="ttl-sec ttl-benefits" data-sec="benefits">
        <div className="ttl-wrap ttl-split">
          <div className="ttl-label">The Science of Retention</div>
          <div>
            <p className="ttl-benefits-text">
              <Marked
                text={"Highlighting textbooks and re-reading notes gives the dangerous illusion of comprehension. With *Study Buddy's Neural Feynman Architecture,* you cannot hide behind jargon. If you cannot explain a concept simply enough for our isolated Child Agent to score 90% on a blind exam, you do not truly understand it."}
                wordClass="ttl-bword"
              />
            </p>
            <div className="ttl-stats">
              {DEFAULT_STATS.map((s) => (
                <StatTile key={s.label} s={s} reduced={reduced} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="ttl-sec ttl-feats" data-sec="features">
        <div className="ttl-wrap">
          <div className="ttl-label ttl-feat-label">Three-Pillar Feynman Cycle</div>
          <div className="ttl-feat-grid">
            <div className="ttl-stage-col">
              <div className="ttl-stage" data-scene={feat % 3}>
                {DEFAULT_FEATURES.map((_, i) => (
                  <div key={i} className="ttl-stage-layer" data-on={feat === i || undefined} aria-hidden={feat !== i}>
                    <Scene i={i} active={feat === i} reduced={reduced} colors={colors} />
                  </div>
                ))}
                <div className="ttl-stage-count" aria-hidden="true">
                  <b>{String(feat + 1).padStart(2, "0")}</b> / {String(DEFAULT_FEATURES.length).padStart(2, "0")}
                </div>
              </div>
            </div>
            <div className="ttl-feat-copy">
              {DEFAULT_FEATURES.map((f, i) => (
                <article key={f.title} className="ttl-feat" data-feat={i} data-on={feat === i || undefined}>
                  <div className="ttl-feat-inline">
                    <Scene i={i} active={feat === i} reduced={reduced} colors={colors} />
                  </div>
                  <span className="ttl-feat-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="ttl-h3 ttl-feat-title">{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage (The 500-Synapse Matrix) */}
      <Coverage
        title="Empirical mastery across up to *500 Neural Concept Nodes* per syllabus"
        items={DEFAULT_COVERAGE}
        reduced={reduced}
      />

      {/* Cognitive Architecture & Comparison (Dark section) */}
      <PricingComparison reduced={reduced} />

      {/* FAQ */}
      <Faq f={{ title: "Everything you need to know about\n*Neural Feynman Learning*", items: DEFAULT_FAQ }} />

      {/* CTA */}
      <Cta
        brand="Study Buddy"
        openSignal={ctaSignal}
        reduced={reduced}
        onStart={onStart}
      />

      {/* Dial / Operating Section */}
      <section className="ttl-sec ttl-op-sec" data-sec="operating">
        <div className="ttl-wrap">
          <div className="ttl-op">
            <div className="ttl-op-copy">
              <h2 className="ttl-h2">
                <Marked text={"Built on Bloom's Taxonomy and\n*Cognitive Load Theory*"} />
              </h2>
              <p>
                From basic recognition to high-order synthesis. The Feynman dial turns passive information consumers into authoritative subject masters through active generative teaching.
              </p>
              <a className="ttl-link-arrow" href="#resources" onClick={go("#resources")}>
                Explore cognitive science whitepapers
                <Icon d={I.arrow} size={15} />
              </a>
            </div>
            <div className="ttl-op-art">
              <Dial />
            </div>
          </div>
        </div>
      </section>

      {/* Resources with Generated High-End Visuals */}
      <section className="ttl-sec ttl-res" data-sec="resources">
        <div className="ttl-wrap">
          <h2 className="ttl-h2 ttl-res-title" data-ttl-rise>
            <Marked text={"*Curated Research* & Architectural Whitepapers on\nActive Generative Learning"} />
          </h2>
          <div className="ttl-res-grid">
            {DEFAULT_RESOURCES.map((r) => (
              <a key={r.title} className="ttl-res-card" href={r.href ?? "#"} onClick={(e) => e.preventDefault()}>
                <div className="ttl-res-thumb">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0c2f35] text-[#93aaa6]">
                      <Icon d={I.brain} size={32} />
                    </div>
                  )}
                </div>
                <div className="ttl-res-cap">
                  <b>{r.title}</b>
                  <span>
                    {r.tag}
                    <Icon d={I.arrow} size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ttl-foot">
        <div className="ttl-wrap">
          <div className="ttl-foot-grid">
            <a href="#" className="ttl-brand" onClick={go("#top")}>
              <BrainMark />
              <span>Study Buddy</span>
            </a>
            {DEFAULT_FOOTER_COLUMNS.map((c) => (
              <div key={c.title} className="ttl-foot-col">
                <b>{c.title}</b>
                {c.links.map((l) => (
                  <a key={l.label} href={l.href ?? "#"} onClick={go(l.href)}>
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="ttl-foot-bar">
            <div className="ttl-foot-legal-links">
              <a href="#">Methodology Terms</a>
              <a href="#">Academic Privacy</a>
              <a href="#">Zero Data Retention</a>
              <span>© Study Buddy Neural Inc.</span>
            </div>
            <div className="ttl-social">
              {[
                { label: "X", d: "M4 4l16 16M20 4L4 20" },
                { label: "LinkedIn", d: "M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 016 0v4" },
                { label: "YouTube", d: "M10 9l5 3-5 3zM3 12c0-3 .5-5 3-5.5C8 6 16 6 18 6.5c2.5.5 3 2.5 3 5.5s-.5 5-3 5.5c-2 .5-10 .5-12 0C3.5 17 3 15 3 12z" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} onClick={(e) => e.preventDefault()}>
                  <Icon d={s.d} size={15} />
                </a>
              ))}
            </div>
          </div>
          <p className="ttl-legal">
            Study Buddy is an active educational synthesis platform based on the Feynman Technique, Cognitive Load Theory, and dual-agent LLM air-gapping. All tests and metrics are generated empirically for conceptual mastery verification.
          </p>
        </div>
        <div className="ttl-bigmark" aria-hidden="true">
          {"STUDY BUDDY".split("").map((ch, i) => (
            <span key={i}>{ch === " " ? " " : ch}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}

const TTL_CSS = `
.ttl-root{--ttl-sans:"Inter Tight","Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;position:relative;min-height:var(--ttl-h);background:var(--ttl-page);color:var(--ttl-ink);font-family:var(--ttl-sans);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip;isolation:isolate;transition:background-color .35s,color .35s}
.ttl-root *,.ttl-root *::before,.ttl-root *::after{box-sizing:border-box}
.ttl-root :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.ttl-root :where(input,textarea){font:inherit;color:inherit}
.ttl-root :where(a){color:inherit;text-decoration:none}
.ttl-root :where(h1,h2,h3,p,ul,dl,dd){margin:0;padding:0}
.ttl-root :where(ul){list-style:none}
.ttl-root :where(button,a,input,textarea,[tabindex]):focus-visible{outline:2px solid var(--ttl-gold);outline-offset:2px;border-radius:6px}
.ttl-svg{display:block;max-width:none;flex:none}
.ttl-sentinel{position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none}
.ttl-wrap{width:100%;max-width:1200px;margin:0 auto;padding:0 24px;position:relative}
.ttl-gold{color:var(--ttl-gold)}
.ttl-h1{font-size:clamp(42px,7.2vw,92px);line-height:1.02;letter-spacing:-.04em;font-weight:400;text-align:center}
.ttl-h2{font-size:clamp(30px,4.4vw,52px);line-height:1.04;letter-spacing:-.035em;font-weight:400}
.ttl-h3{font-size:18px;line-height:1.25;letter-spacing:-.01em;font-weight:500}
.ttl-k{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ttl-muted)}
.ttl-fine{font-size:12px;line-height:1.5;color:var(--ttl-muted)}
.ttl-mask{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}
.ttl-hero-word{display:inline-block;will-change:transform}

.ttl-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 22px;border-radius:999px;font-size:14px;font-weight:500;white-space:nowrap;transition:transform .22s cubic-bezier(.16,1,.3,1),background-color .2s,box-shadow .24s cubic-bezier(.16,1,.3,1),opacity .2s;cursor:pointer;user-select:none;-webkit-user-select:none}
.ttl-btn:hover{transform:translateY(-1.5px)}
.ttl-btn:active{transform:translateY(0) scale(.96);transition:transform .08s cubic-bezier(.16,1,.3,1)}
.ttl-btn:disabled{opacity:.6;cursor:default;transform:none}
.ttl-btn-sm{height:36px;padding:0 16px;font-size:13px}
.ttl-btn-dark{background:var(--ttl-accent);color:var(--ttl-accent-ink)}
.ttl-btn-dark:hover{box-shadow:0 10px 24px -10px var(--ttl-accent)}
.ttl-btn-lilac{background:var(--ttl-lilac);color:var(--ttl-lilac-ink)}
.ttl-btn-ghost{border:1px solid var(--ttl-rule);background:var(--ttl-paper)}
.ttl-btn-glass{background:rgba(255,255,255,.42);color:var(--ttl-ink);border:1px solid rgba(255,255,255,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.ttl-btn[data-busy]{opacity:.8}
.ttl-link{font-size:13px;text-decoration:underline;text-underline-offset:3px;color:var(--ttl-muted);background:none;border:0;cursor:pointer}
.ttl-link:hover{color:var(--ttl-ink)}

/* nav */
.ttl-nav{position:sticky;top:0;z-index:40;transition:background-color .35s,box-shadow .35s,backdrop-filter .35s}
.ttl-nav[data-scrolled]{background:color-mix(in srgb,var(--ttl-page) 82%,transparent);backdrop-filter:saturate(1.4) blur(16px);-webkit-backdrop-filter:saturate(1.4) blur(16px);box-shadow:0 1px 0 var(--ttl-rule)}
.ttl-nav-in{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;gap:28px;position:relative}
.ttl-brand{display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:16px;letter-spacing:-.02em;transition:opacity .2s}
.ttl-brand:hover{opacity:.85}
.ttl-nav-links{display:flex;align-items:center;gap:6px;flex:1}
.ttl-nav-link{display:inline-flex;align-items:center;gap:4px;padding:8px 12px;border-radius:10px;font-size:13.5px;font-weight:500;color:var(--ttl-ink);opacity:.82;transition:opacity .18s,background-color .18s,transform .2s cubic-bezier(.16,1,.3,1);cursor:pointer}
.ttl-nav-link:hover,.ttl-nav-link[aria-expanded="true"]{opacity:1;background:color-mix(in srgb,var(--ttl-ink) 6%,transparent);transform:translateY(-0.5px)}
.ttl-nav-link:active{transform:scale(0.96)}
.ttl-caret{transition:transform .3s cubic-bezier(.16,1,.3,1)}
.ttl-nav-link[aria-expanded="true"] .ttl-caret{transform:rotate(180deg)}
.ttl-nav-end{display:flex;align-items:center;gap:8px;margin-left:auto}
.ttl-nav-sep{height:20px;width:1px;background:var(--ttl-rule);margin:0 4px}
.ttl-prod{position:relative}
.ttl-prod-panel{position:absolute;top:calc(100% + 10px);left:-12px;width:390px;padding:10px;border-radius:18px;background:color-mix(in srgb,var(--ttl-paper) 92%,transparent);backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);border:1px solid var(--ttl-rule);box-shadow:0 24px 50px -18px rgba(16,41,45,.25),0 0 0 1px rgba(255,255,255,.05);opacity:0;visibility:hidden;transform:translateY(-8px) scale(.96);transform-origin:18% 0;transition:opacity .22s cubic-bezier(.16,1,.3,1),transform .28s cubic-bezier(.16,1,.3,1),visibility .22s}
.ttl-prod-panel::before{content:"";position:absolute;left:0;right:0;top:-12px;height:12px}
.ttl-prod-panel[data-open]{opacity:1;visibility:visible;transform:translateY(0) scale(1)}
.ttl-prod-item{display:flex;gap:12px;padding:12px;border-radius:12px;transition:background-color .2s,transform .2s cubic-bezier(.16,1,.3,1)}
.ttl-prod-item:hover{background:var(--ttl-page);transform:translateX(3px)}
.ttl-prod-item b{display:block;font-weight:500;font-size:14px}
.ttl-prod-item small{display:block;font-size:12.5px;color:var(--ttl-muted);line-height:1.4}
.ttl-prod-ic{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:var(--ttl-page);color:var(--ttl-gold);flex:none;transition:transform .2s}
.ttl-prod-item:hover .ttl-prod-ic{transform:scale(1.08)}
.ttl-burger{display:none;width:40px;height:40px;place-items:center;border-radius:10px}
.ttl-sheet{display:none}
.ttl-progress{position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--ttl-gold);transform:scaleX(0);transform-origin:0 50%;opacity:.9}

/* hero */
.ttl-hero{position:relative;padding:72px 0 0}
.ttl-hero-glow{position:absolute;left:50%;top:260px;width:min(1100px,120vw);height:640px;transform:translateX(-50%);background:radial-gradient(closest-side,color-mix(in srgb,var(--ttl-lilac) 70%,transparent),transparent 72%);opacity:.65;pointer-events:none;z-index:-1}
.ttl-hero-grid{position:absolute;inset:0 0 auto 0;height:560px;background-image:linear-gradient(var(--ttl-rule) 1px,transparent 1px),linear-gradient(90deg,var(--ttl-rule) 1px,transparent 1px);background-size:64px 64px;background-position:center -1px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 50% 0%,#000 30%,transparent 75%);mask-image:radial-gradient(ellipse 60% 70% at 50% 0%,#000 30%,transparent 75%);opacity:.55;pointer-events:none;z-index:-1}
.ttl-hero-head{display:flex;flex-direction:column;align-items:center;text-align:center}
.ttl-hero-text{max-width:620px;margin-top:22px;font-size:17px;color:var(--ttl-muted);line-height:1.6}
.ttl-hero-ctas{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap;justify-content:center}
.ttl-device-wrap{position:relative;max-width:1080px;margin:54px auto 0;padding:0 24px;perspective:1800px}
.ttl-device{transform-origin:50% 100%;will-change:transform}
.ttl-hero-showcase{position:relative;max-width:880px;margin:0 auto}
.ttl-hero-img-card{position:relative;border-radius:28px;overflow:hidden;border:1px solid var(--ttl-rule);background:var(--ttl-card);box-shadow:0 30px 70px -15px rgba(15,50,56,0.18),0 1px 3px rgba(15,50,56,0.06);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s ease}
.ttl-hero-img-card:hover{transform:translateY(-4px);box-shadow:0 38px 80px -16px rgba(15,50,56,0.24),0 1px 3px rgba(15,50,56,0.08)}
.ttl-hero-img{width:100%;height:auto;display:block;object-fit:cover;aspect-ratio:959/1024;max-height:640px;object-position:center top}
.ttl-hero-img-pill{position:absolute;bottom:24px;left:24px;display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:rgba(15,50,56,0.88);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.16);color:#fff;font-size:13px;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,0.22);letter-spacing:-0.01em}
.ttl-hero-pill-dot{width:8px;height:8px;border-radius:50%;background:#c2983b;box-shadow:0 0 10px #c2983b}
.ttl-device-bezel{border-radius:22px;padding:10px;background:linear-gradient(160deg,#1b1f22,#0b0d0e);box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 50px 100px -40px rgba(16,41,45,.55),0 20px 40px -30px rgba(16,41,45,.4)}
.ttl-floats{position:absolute;inset:0;z-index:3;pointer-events:none}
.ttl-float{position:absolute;right:-28px;top:-36px}
.ttl-float-2{right:auto;top:auto;left:-72px;bottom:26px}
.ttl-float-2 .ttl-flow{width:320px}
.ttl-float-in{will-change:transform}
.ttl-flow{pointer-events:auto;width:340px;padding:12px 14px;border-radius:12px;background:var(--ttl-deep);color:var(--ttl-deep-ink);box-shadow:0 24px 50px -24px rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.06);animation:ttl-flash .9s cubic-bezier(.2,.8,.2,1)}
.ttl-flow-top{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px;font-size:12px;color:var(--ttl-deep-muted);margin-bottom:10px}
.ttl-flow-top b{color:var(--ttl-deep-ink);font-weight:600;font-variant-numeric:tabular-nums}
.ttl-flow-top em{font-style:normal;color:var(--ttl-gold)}
.ttl-flow-row{display:flex;align-items:center;gap:8px}
.ttl-flow-chip{display:inline-flex;align-items:center;gap:6px;flex:0 1 auto;min-width:0;padding:7px 9px;border-radius:8px;background:rgba(255,255,255,.07);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ttl-flow-chip i{width:16px;height:16px;border-radius:5px;background:var(--ttl-gold);flex:none}
.ttl-flow-chip-b i{background:var(--ttl-lilac)}
.ttl-flow-arrow{color:var(--ttl-deep-muted)}
.ttl-flow-arrow path{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.ttl-flow-arrow path:first-child{stroke-dasharray:3 4;animation:ttl-dash 1s linear infinite}
@keyframes ttl-dash{to{stroke-dashoffset:-14}}
@keyframes ttl-flash{from{box-shadow:0 0 0 2px var(--ttl-gold),0 24px 50px -24px rgba(0,0,0,.55)}}

/* dashboard */
.ttl-dash{display:grid;grid-template-columns:220px 1fr;height:620px;border-radius:13px;overflow:hidden;background:var(--ttl-paper);color:var(--ttl-ink);font-size:13px}
.ttl-side{background:color-mix(in srgb,var(--ttl-page) 70%,var(--ttl-paper));border-right:1px solid var(--ttl-rule);padding:16px 10px;display:flex;flex-direction:column;gap:2px;overflow:hidden}
.ttl-side-brand{display:flex;align-items:center;gap:8px;font-weight:600;font-size:12.5px;padding:2px 8px 14px}
.ttl-side-label{font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--ttl-muted);padding:12px 8px 6px}
.ttl-side-item,.ttl-side-acc{display:flex;align-items:center;gap:9px;width:100%;padding:7px 8px;border-radius:7px;text-align:left;color:var(--ttl-muted);transition:background-color .2s,color .2s}
.ttl-side-item:hover,.ttl-side-acc:hover{background:color-mix(in srgb,var(--ttl-ink) 5%,transparent);color:var(--ttl-ink)}
.ttl-side-item[data-on],.ttl-side-acc[data-on]{background:var(--ttl-paper);color:var(--ttl-ink);box-shadow:0 1px 2px rgba(16,41,45,.08),0 0 0 1px var(--ttl-rule)}
.ttl-side-acc i{width:8px;height:8px;border-radius:3px;flex:none}
.ttl-side-acc span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ttl-side-acc small{font-variant-numeric:tabular-nums;font-size:11.5px}
.ttl-side-foot{margin-top:auto;display:flex;align-items:center;gap:9px;padding:7px 8px;color:var(--ttl-muted);font-size:12.5px}
.ttl-main{position:relative;padding:18px 26px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.ttl-crumbs{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ttl-muted);padding-bottom:14px;border-bottom:1px solid var(--ttl-rule)}
.ttl-crumbs b{color:var(--ttl-ink);font-weight:500}
.ttl-live{margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;background:color-mix(in srgb,var(--ttl-good) 10%,transparent);color:var(--ttl-good);font-size:11px}
.ttl-live i{width:6px;height:6px;border-radius:50%;background:currentColor;animation:ttl-pulse 1.8s ease-in-out infinite}
@keyframes ttl-pulse{50%{opacity:.25}}
.ttl-tabs-sm{display:none}
.ttl-view{padding-top:18px;flex:1;min-height:0;display:flex;flex-direction:column;animation:ttl-in .55s cubic-bezier(.2,.8,.2,1)}
@keyframes ttl-in{from{opacity:0;transform:translateY(10px);filter:blur(4px)}}
.ttl-ov-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start}
.ttl-ov-head .ttl-k{margin-top:14px}
.ttl-total{font-size:clamp(26px,3.4vw,38px);letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1.15;margin-top:2px}
.ttl-delta{font-size:12px;color:var(--ttl-muted);margin-top:4px}
.ttl-delta span{color:var(--ttl-good);font-weight:500}
.ttl-spark{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex:1;max-width:320px}
.ttl-spark-svg{width:100%;height:84px}
.ttl-seg{display:inline-flex;padding:3px;border-radius:9px;background:var(--ttl-page);border:1px solid var(--ttl-rule)}
.ttl-seg button{padding:4px 10px;border-radius:6px;font-size:11.5px;color:var(--ttl-muted);transition:background-color .25s,color .25s,box-shadow .25s}
.ttl-seg button[aria-selected="true"]{background:var(--ttl-paper);color:var(--ttl-ink);box-shadow:0 1px 2px rgba(16,41,45,.12)}
.ttl-accs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}
.ttl-acc{display:flex;flex-direction:column;gap:3px;text-align:left;padding:12px;border-radius:10px;border:1px solid var(--ttl-rule);background:var(--ttl-paper);transition:border-color .25s,transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s,opacity .3s;cursor:pointer}
.ttl-acc:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ttl-ink) 25%,transparent);box-shadow:0 14px 26px -18px rgba(16,41,45,.4)}
.ttl-acc[data-on]{border-color:var(--ttl-gold);box-shadow:0 0 0 3px color-mix(in srgb,var(--ttl-gold) 18%,transparent)}
.ttl-acc[data-dim]{opacity:.5}
.ttl-acc-top{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ttl-muted)}
.ttl-acc-top i{width:8px;height:8px;border-radius:3px}
.ttl-acc-go{margin-left:auto;opacity:0;transform:translateX(-4px);transition:opacity .25s,transform .25s}
.ttl-acc:hover .ttl-acc-go{opacity:1;transform:none}
.ttl-acc-bal{font-size:15px;font-variant-numeric:tabular-nums;letter-spacing:-.01em;font-weight:500}
.ttl-acc-kind{font-size:11px;color:var(--ttl-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ttl-recent{margin-top:16px;display:flex;flex-direction:column}
.ttl-recent-head{display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;font-size:12.5px}
.ttl-recent-head b{font-weight:500}
.ttl-recent-row{display:grid;grid-template-columns:68px 1fr auto;gap:12px;align-items:center;padding:7px 0;border-top:1px solid var(--ttl-rule);font-size:12px;animation:ttl-in .45s cubic-bezier(.2,.8,.2,1) both}
.ttl-recent-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ttl-break{margin-top:auto;padding-top:16px}
.ttl-break-head{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}
.ttl-break-head b{font-weight:500;font-size:13px}
.ttl-break-head span{font-size:11.5px;color:var(--ttl-muted)}
.ttl-bar{position:relative;display:flex;gap:3px;height:12px}
.ttl-bar span{display:block;height:100%;border-radius:3px;min-width:3px;transition:opacity .3s,transform .3s;outline-offset:2px}
.ttl-bar span:hover,.ttl-bar span:focus-visible{transform:scaleY(1.35)}
.ttl-bar span[data-dim]{opacity:.3}
.ttl-bar-lg{height:16px}
.ttl-tip{position:absolute;bottom:calc(100% + 8px);transform:translateX(-50%);padding:5px 9px;border-radius:7px;background:var(--ttl-ink);color:var(--ttl-paper);font-size:11px;font-style:normal;white-space:nowrap;pointer-events:none;animation:ttl-in .25s}
.ttl-legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:10px;font-size:11.5px;color:var(--ttl-muted)}
.ttl-legend span{display:inline-flex;align-items:center;gap:6px}
.ttl-legend i{width:8px;height:8px;border-radius:3px}

.ttl-move .ttl-h3,.ttl-act .ttl-h3{margin-bottom:14px}
.ttl-form{display:flex;flex-direction:column;gap:12px;max-width:560px}
.ttl-pick{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
.ttl-pick-col{display:flex;flex-direction:column;gap:6px}
.ttl-pill{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:8px;border:1px solid var(--ttl-rule);font-size:12.5px;transition:border-color .2s,background-color .2s,box-shadow .2s;cursor:pointer}
.ttl-pill small{color:var(--ttl-muted);font-variant-numeric:tabular-nums}
.ttl-pill[aria-pressed="true"]{border-color:var(--ttl-ink);background:color-mix(in srgb,var(--ttl-gold) 8%,var(--ttl-paper));box-shadow:0 0 0 1px var(--ttl-ink) inset}
.ttl-swap-icon{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid var(--ttl-rule);color:var(--ttl-gold)}
.ttl-field{display:flex;flex-direction:column;gap:6px}
.ttl-explain-area{border:1px solid var(--ttl-rule);border-radius:8px;padding:10px;font-size:13px;line-height:1.45;background:var(--ttl-paper);outline:0;resize:none}
.ttl-explain-area:focus{border-color:var(--ttl-ink)}
.ttl-chips{display:flex;gap:6px;flex-wrap:wrap}
.ttl-chips button{padding:5px 10px;border-radius:999px;background:var(--ttl-page);font-size:12px;border:1px solid var(--ttl-rule);transition:background-color .2s;cursor:pointer}
.ttl-chips button:hover{background:var(--ttl-paper)}
.ttl-memo{border:1px solid var(--ttl-rule);border-radius:8px;padding:8px 10px;font-size:12.5px;background:var(--ttl-paper);outline:0}
.ttl-memo:focus{border-color:var(--ttl-ink)}
.ttl-form .ttl-btn{align-self:flex-start;height:40px}
.ttl-err{font-size:12.5px;color:#b3412e}
.ttl-review{display:flex;flex-direction:column;gap:14px;max-width:480px;animation:ttl-in .5s cubic-bezier(.2,.8,.2,1)}
.ttl-route{display:flex;align-items:center;gap:12px;font-size:13px}
.ttl-route span{padding:6px 10px;border-radius:8px;background:var(--ttl-page);border:1px solid var(--ttl-rule)}
.ttl-route-line{color:var(--ttl-gold)}
.ttl-route-line path{stroke-dasharray:4 4;animation:ttl-dash .8s linear infinite}
.ttl-review-amt{font-size:28px;letter-spacing:-.03em;font-weight:500}
.ttl-dl{display:flex;flex-direction:column;border-top:1px solid var(--ttl-rule)}
.ttl-dl div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--ttl-rule);font-size:12.5px}
.ttl-dl dt{color:var(--ttl-muted)}
.ttl-dl dd{font-variant-numeric:tabular-nums;font-weight:500}
.ttl-row{display:flex;gap:8px}
.ttl-row .ttl-btn{height:40px}
.ttl-done{display:flex;align-items:center;flex-wrap:wrap;gap:10px;font-weight:500}
.ttl-done-ic{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--ttl-good);color:#fff;animation:ttl-pop .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes ttl-pop{from{transform:scale(.3);opacity:0}}
.ttl-act{display:flex;flex-direction:column;min-height:0;flex:1}
.ttl-act-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.ttl-ledger{overflow:auto;flex:1;min-height:0;border-top:1px solid var(--ttl-rule);scrollbar-width:thin}
.ttl-ledger li{display:grid;grid-template-columns:64px 1fr auto 110px;align-items:center;gap:12px;padding:11px 2px;border-bottom:1px solid var(--ttl-rule);animation:ttl-in .45s cubic-bezier(.2,.8,.2,1) both}
.ttl-led-date{color:var(--ttl-muted);font-size:12px}
.ttl-led-text{display:flex;flex-direction:column;min-width:0}
.ttl-led-text small{color:var(--ttl-muted);font-size:11px}
.ttl-led-status{font-size:11px;padding:2px 8px;border-radius:999px;background:var(--ttl-page);color:var(--ttl-muted)}
.ttl-led-status[data-s="Verified"]{background:color-mix(in srgb,var(--ttl-good) 10%,transparent);color:var(--ttl-good)}
.ttl-led-status[data-s="Consolidated"]{background:color-mix(in srgb,var(--ttl-gold) 14%,transparent);color:var(--ttl-gold)}
.ttl-led-amt{text-align:right;font-variant-numeric:tabular-nums;font-weight:500}
.ttl-led-amt[data-in]{color:var(--ttl-good)}
.ttl-led-empty{display:block!important;color:var(--ttl-muted);padding:20px 2px}

/* sections */
.ttl-sec{position:relative;padding:120px 0}
.ttl-split{display:grid;grid-template-columns:220px 1fr;gap:40px}
.ttl-label{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--ttl-gold);height:max-content;padding-top:8px}
.ttl-label::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 0 0 currentColor;animation:ttl-ping 2.4s ease-out infinite}
@keyframes ttl-ping{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ttl-gold) 50%,transparent)}80%,100%{box-shadow:0 0 0 8px transparent}}
.ttl-benefits{border-bottom:1px solid var(--ttl-rule)}
.ttl-benefits-text{font-size:clamp(22px,2.7vw,32px);line-height:1.35;letter-spacing:-.02em;max-width:840px}
.ttl-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:80px;max-width:840px}
.ttl-stat{position:relative;display:flex;flex-direction:column;gap:6px;padding-top:18px}
.ttl-stat-rule{position:absolute;top:0;left:0;right:0;height:1px;background:var(--ttl-ink);opacity:.25;transform-origin:0 50%}
.ttl-stat b{font-size:clamp(40px,5vw,60px);font-weight:400;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.ttl-stat span:last-child{font-size:12.5px;color:var(--ttl-muted)}

/* features */
.ttl-feats{background:color-mix(in srgb,var(--ttl-page) 60%,var(--ttl-rule))}
.ttl-feat-label{margin-bottom:24px}
.ttl-feat-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:80px}
.ttl-stage-col{position:relative}
.ttl-stage{position:sticky;top:calc(50vh - 260px);height:520px;border-radius:14px;overflow:hidden;background:var(--ttl-paper);box-shadow:0 1px 0 var(--ttl-rule),0 40px 80px -50px rgba(16,41,45,.35);transition:background-color .7s}
.ttl-stage[data-scene="1"]{background:color-mix(in srgb,var(--ttl-paper) 92%,var(--ttl-gold) 8%);border:1px solid var(--ttl-rule)}
.ttl-root[data-dark] .ttl-stage[data-scene="1"]{background:var(--ttl-deep);border-color:transparent}
.ttl-stage-layer{position:absolute;inset:0;opacity:0;visibility:hidden;transform:translateY(24px) scale(.97);filter:blur(6px);transition:opacity .6s,transform .8s cubic-bezier(.2,.8,.2,1),filter .6s,visibility .6s}
.ttl-stage-layer[data-on]{opacity:1;visibility:visible;transform:none;filter:none}
.ttl-stage-count{position:absolute;left:18px;bottom:14px;font-size:11.5px;letter-spacing:.06em;color:var(--ttl-muted);font-variant-numeric:tabular-nums;transition:color .6s}
.ttl-stage[data-scene="1"] .ttl-stage-count{color:var(--ttl-muted)}
.ttl-root[data-dark] .ttl-stage[data-scene="1"] .ttl-stage-count{color:var(--ttl-deep-muted)}
.ttl-stage-count b{color:var(--ttl-gold);font-weight:500}
.ttl-feat-copy{display:flex;flex-direction:column}
.ttl-feat{min-height:72vh;display:flex;flex-direction:column;justify-content:center;gap:12px;opacity:.35;transition:opacity .5s}
.ttl-feat[data-on]{opacity:1}
.ttl-feat-n{font-size:12px;color:var(--ttl-gold);letter-spacing:.08em}
.ttl-feat-title{font-size:clamp(22px,2.4vw,28px);letter-spacing:-.02em;font-weight:400}
.ttl-feat p{color:var(--ttl-muted);max-width:440px;line-height:1.6}
.ttl-feat-inline{display:none}
.ttl-scene{position:absolute;inset:0;display:grid;place-items:center;padding:28px}

.ttl-setup-card{position:relative;width:min(420px,100%);padding:18px;border-radius:14px;background:var(--ttl-paper);border:1px solid var(--ttl-rule);box-shadow:0 24px 50px -30px rgba(16,41,45,.35)}
.ttl-setup-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}
.ttl-setup-head span{display:flex;flex-direction:column}
.ttl-setup-head b{font-weight:500;font-size:14px}
.ttl-setup-head small{font-size:11.5px;color:var(--ttl-muted)}
.ttl-setup-list{display:flex;flex-direction:column;gap:6px}
.ttl-setup-list button{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border-radius:10px;border:1px solid var(--ttl-rule);font-size:13px;text-align:left;transition:border-color .35s,background-color .35s;cursor:pointer}
.ttl-setup-list button[data-on]{border-color:color-mix(in srgb,var(--ttl-good) 35%,transparent);background:color-mix(in srgb,var(--ttl-good) 5%,var(--ttl-paper))}
.ttl-setup-ic{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:var(--ttl-page);color:var(--ttl-gold);flex:none}
.ttl-tick{margin-left:auto;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--ttl-rule);color:transparent;transition:background-color .3s,border-color .3s,color .3s,transform .45s cubic-bezier(.3,1.6,.5,1)}
.ttl-setup-list button[data-on] .ttl-tick{background:var(--ttl-good);border-color:var(--ttl-good);color:#fff;transform:scale(1.08)}
.ttl-setup-list button[data-last]{border-style:dashed}
.ttl-setup-foot{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:11.5px;color:var(--ttl-muted);font-variant-numeric:tabular-nums}
.ttl-meter{flex:1;height:4px;border-radius:2px;background:var(--ttl-page);overflow:hidden}
.ttl-meter i{display:block;height:100%;background:var(--ttl-good);border-radius:2px;transition:width .5s cubic-bezier(.2,.8,.2,1)}
.ttl-cursor{position:absolute;right:-30px;top:42%;transition:transform 1.1s cubic-bezier(.6,0,.2,1);pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.2))}
.ttl-cursor[data-at]{transform:translate(-80px,82px)}
.ttl-cursor[data-click]{animation:ttl-click .35s .1s}
@keyframes ttl-click{50%{scale:.8}}

.ttl-scene-phone{overflow:hidden;color:var(--ttl-ink)}
.ttl-root[data-dark] .ttl-scene-phone{color:var(--ttl-deep-ink)}
.ttl-bokeh{position:absolute;inset:-20%;background:radial-gradient(circle at 18% 30%,color-mix(in srgb,var(--ttl-gold) 28%,transparent) 0,transparent 20%),radial-gradient(circle at 82% 22%,color-mix(in srgb,var(--ttl-lilac) 24%,transparent) 0,transparent 18%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--ttl-accent) 18%,transparent) 0,transparent 22%),radial-gradient(circle at 30% 85%,rgba(255,255,255,.4) 0,transparent 15%);filter:blur(22px);animation:ttl-drift 14s ease-in-out infinite alternate}
.ttl-root[data-dark] .ttl-bokeh{background:radial-gradient(circle at 18% 30%,color-mix(in srgb,var(--ttl-gold) 55%,transparent) 0,transparent 18%),radial-gradient(circle at 82% 22%,color-mix(in srgb,var(--ttl-lilac) 40%,transparent) 0,transparent 14%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--ttl-gold) 30%,transparent) 0,transparent 20%),radial-gradient(circle at 30% 85%,rgba(255,255,255,.12) 0,transparent 10%)}
@keyframes ttl-drift{to{transform:translate(4%,-3%) scale(1.06)}}
.ttl-phone{position:relative;width:220px;height:430px;padding:9px;border-radius:38px;background:linear-gradient(150deg,#e8e4dc,#d6cfbf 60%);box-shadow:0 0 0 1px rgba(0,0,0,.08) inset,0 30px 60px -20px rgba(15,50,56,.2);transform:perspective(1100px) rotateY(-14deg) rotateX(6deg) rotateZ(4deg);transition:transform 1s cubic-bezier(.2,.8,.2,1)}
.ttl-root[data-dark] .ttl-phone{background:linear-gradient(150deg,#2b3134,#0c0e0f 60%);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 40px 70px -20px rgba(0,0,0,.65)}
.ttl-stage-layer[data-on] .ttl-phone,.ttl-feat[data-on] .ttl-phone{transform:perspective(1100px) rotateY(-8deg) rotateX(4deg) rotateZ(2deg)}
.ttl-phone-screen{position:relative;height:100%;border-radius:30px;overflow:hidden;background:#ffffff;padding:16px 14px;display:flex;flex-direction:column;gap:8px;border:1px solid rgba(0,0,0,.05)}
.ttl-root[data-dark] .ttl-phone-screen{background:linear-gradient(180deg,color-mix(in srgb,var(--ttl-deep) 80%,#000),var(--ttl-deep));border-color:transparent}
.ttl-phone-status{display:flex;justify-content:space-between;align-items:center;font-size:10px;opacity:.8;margin-bottom:6px;color:var(--ttl-ink)}
.ttl-root[data-dark] .ttl-phone-status{color:var(--ttl-deep-ink)}
.ttl-phone-status i{width:46px;height:14px;border-radius:999px;background:#1a202c;position:absolute;left:50%;top:10px;transform:translateX(-50%)}
.ttl-root[data-dark] .ttl-phone-status i{background:#000}
.ttl-phone-k{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ttl-muted);margin-top:8px}
.ttl-root[data-dark] .ttl-phone-k{color:var(--ttl-deep-muted)}
.ttl-phone-bal{font-size:26px;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--ttl-ink)}
.ttl-root[data-dark] .ttl-phone-bal{color:var(--ttl-deep-ink)}
.ttl-phone-chart{width:100%;height:48px}
.ttl-phone-card{display:flex;flex-direction:column;padding:10px;border-radius:12px;background:rgba(15,50,56,.05);border:1px solid rgba(15,50,56,.08);font-size:10.5px;color:var(--ttl-muted)}
.ttl-root[data-dark] .ttl-phone-card{background:rgba(255,255,255,.07);border-color:transparent;color:var(--ttl-deep-muted)}
.ttl-phone-card b{font-size:12px;color:var(--ttl-ink);font-weight:500;margin-top:4px;line-height:1.4}
.ttl-root[data-dark] .ttl-phone-card b{color:var(--ttl-deep-ink);font-weight:400}
.ttl-phone-btn{margin-top:auto;padding:11px;border-radius:12px;background:var(--ttl-accent);color:var(--ttl-accent-ink);font-size:12px;font-weight:500;transition:transform .2s,filter .2s;cursor:pointer}
.ttl-root[data-dark] .ttl-phone-btn{background:var(--ttl-gold);color:#fff}
.ttl-phone-btn:hover{filter:brightness(1.08)}
.ttl-phone-btn:active{transform:scale(.97)}
.ttl-phone-sheet{position:absolute;left:6px;right:6px;bottom:6px;padding:10px 14px 16px;border-radius:24px;background:var(--ttl-paper);color:var(--ttl-ink);display:flex;flex-direction:column;gap:10px;transform:translateY(110%);transition:transform .55s cubic-bezier(.2,.9,.2,1);box-shadow:0 -10px 30px rgba(0,0,0,.15)}
.ttl-root[data-dark] .ttl-phone-sheet{box-shadow:0 -10px 30px rgba(0,0,0,.3)}
.ttl-phone-sheet[data-open]{transform:none}
.ttl-phone-grip{width:34px;height:4px;border-radius:2px;background:var(--ttl-rule);margin:0 auto 4px}
.ttl-phone-sheet b{font-size:12.5px;font-weight:500}
.ttl-phone-amt{font-size:14px;letter-spacing:-.01em;font-weight:600;color:var(--ttl-gold)}
.ttl-phone-sheet button{padding:10px;border-radius:12px;background:var(--ttl-accent);color:var(--ttl-accent-ink);font-size:12px;cursor:pointer}
.ttl-phone-sent{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:4px 0}
.ttl-phone-sent small{font-size:11px;color:var(--ttl-muted)}
.ttl-phone-sent button{align-self:stretch;margin-top:6px}
.ttl-chipfloat{position:absolute;display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.88);border:1px solid rgba(15,50,56,.12);box-shadow:0 8px 24px -6px rgba(15,50,56,.12);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:11.5px;color:var(--ttl-ink);animation:ttl-bob 5s ease-in-out infinite;z-index:2}
.ttl-root[data-dark] .ttl-chipfloat{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.14);box-shadow:none;color:var(--ttl-deep-ink)}
.ttl-chipfloat svg{color:var(--ttl-gold)}
.ttl-chipfloat-a{left:6%;top:12%}
.ttl-chipfloat-b{right:6%;bottom:16%;animation-delay:-2.5s}
@keyframes ttl-bob{50%{transform:translateY(-8px)}}

.ttl-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:linear-gradient(90deg,var(--ttl-gold) var(--ttl-fill,50%),var(--ttl-rule) var(--ttl-fill,50%));outline-offset:6px;cursor:pointer}
.ttl-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--ttl-paper);border:2px solid var(--ttl-gold);box-shadow:0 2px 6px rgba(0,0,0,.2);transition:transform .2s}
.ttl-range::-webkit-slider-thumb:hover{transform:scale(1.15)}
.ttl-range::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--ttl-paper);border:2px solid var(--ttl-gold)}
.ttl-range-lg{height:6px;border-radius:3px}

.ttl-rep-card{position:relative;width:min(440px,100%);padding:18px;border-radius:14px;background:var(--ttl-paper);border:1px solid var(--ttl-rule);box-shadow:0 30px 60px -36px rgba(16,41,45,.4);z-index:1}
.ttl-rep-back{position:absolute;width:min(440px,80%);height:280px;transform:translate(46px,-34px) rotate(3deg);opacity:.6;z-index:0;box-shadow:none}
.ttl-stage-layer[data-on] .ttl-rep-back{animation:ttl-fan .9s .1s cubic-bezier(.2,.8,.2,1) both}
@keyframes ttl-fan{from{transform:translate(0,0) rotate(0)}}
.ttl-rep-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.ttl-rep-head b{font-weight:500}
.ttl-rep-total{font-size:28px;letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin:2px 0 14px}
.ttl-rep-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.ttl-rep-row div{display:flex;flex-direction:column;gap:2px;padding:8px;border-radius:8px;border:1px solid var(--ttl-rule);font-size:11px;color:var(--ttl-muted)}
.ttl-rep-row span{display:inline-flex;align-items:center;gap:5px}
.ttl-rep-row b{color:var(--ttl-ink);font-size:13px;font-weight:500;font-variant-numeric:tabular-nums}

/* coverage */
.ttl-cov{border-top:1px solid var(--ttl-rule)}
.ttl-cov-title{max-width:820px}
.ttl-cov-items{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;border-top:1px solid var(--ttl-rule)}
.ttl-cov-item{display:flex;flex-direction:column;gap:2px;padding:22px 20px 22px 0;font-size:13px}
.ttl-cov-item + .ttl-cov-item{padding-left:20px;border-left:1px solid var(--ttl-rule)}
.ttl-cov-item b{font-weight:500;margin-top:14px}
.ttl-cov-item small{color:var(--ttl-muted);font-size:12.5px}
.ttl-cov-ic{display:grid;place-items:center;width:40px;height:40px;border-radius:10px;border:1px solid var(--ttl-rule);color:var(--ttl-gold);background:var(--ttl-paper)}
.ttl-cov-calc{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:48px;margin-top:48px;padding:32px;border-radius:16px;background:var(--ttl-paper);border:1px solid var(--ttl-rule)}
.ttl-cov-ctl{display:flex;flex-direction:column;gap:12px}
.ttl-cov-dep{font-size:clamp(36px,4.6vw,52px);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.ttl-cov-scale{display:flex;justify-content:space-between;font-size:11.5px;color:var(--ttl-muted)}
.ttl-cov-out{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.ttl-cov-out div{padding:12px;border-radius:10px;background:var(--ttl-page)}
.ttl-cov-out dt{font-size:11px;color:var(--ttl-muted)}
.ttl-cov-out dd{font-size:20px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.ttl-cov-out div[data-over] dd{color:var(--ttl-gold)}
.ttl-dots-wrap{display:flex;flex-direction:column;justify-content:center;gap:14px}
.ttl-dots{display:grid;grid-template-columns:repeat(50,1fr);gap:4px;align-content:center}
.ttl-dots i{display:block;aspect-ratio:1;border-radius:50%;background:var(--ttl-page);border:1px solid var(--ttl-rule);transition:background-color .35s,border-color .35s,transform .35s}
.ttl-dots i[data-on]{background:var(--ttl-accent);border-color:var(--ttl-accent);transform:scale(.86)}

/* pricing / architecture */
.ttl-price{background:var(--ttl-deep);color:var(--ttl-deep-ink);overflow:hidden}
.ttl-price .ttl-label{color:var(--ttl-gold)}
.ttl-price-glow{position:absolute;right:-20%;top:-30%;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--ttl-gold) 22%,transparent),transparent);pointer-events:none;animation:ttl-drift 16s ease-in-out infinite alternate}
.ttl-price-big{font-size:clamp(44px,6vw,76px);font-weight:400;letter-spacing:-.045em;line-height:1;color:var(--ttl-deep-muted)}
.ttl-price-big span{color:var(--ttl-deep-ink)}
.ttl-price-intro{margin-top:56px;font-size:13px;color:var(--ttl-deep-muted)}
.ttl-price-list{margin-top:16px;border-top:1px solid rgba(255,255,255,.12);max-width:820px}
.ttl-price-list > li{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.12);font-size:14.5px}
.ttl-price-check{color:var(--ttl-gold);fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ttl-price-check path{stroke-dasharray:26}
.ttl-plus{display:grid;place-items:center;flex:none;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.ttl-plus[data-open]{transform:rotate(135deg)}
.ttl-price .ttl-plus{color:var(--ttl-gold)}
.ttl-collapse{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.2,.8,.2,1)}
.ttl-collapse[data-open]{grid-template-rows:1fr}
.ttl-collapse > div{overflow:hidden;min-height:0}
.ttl-compare{margin-top:40px;max-width:820px;padding:22px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1)}
.ttl-compare-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-size:13px;color:var(--ttl-deep-muted)}
.ttl-step{display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.18);border-radius:999px}
.ttl-step button{width:32px;height:30px;font-size:16px;color:var(--ttl-deep-ink);cursor:pointer}
.ttl-step output{min-width:28px;text-align:center;color:var(--ttl-deep-ink);font-variant-numeric:tabular-nums}
.ttl-cbar{display:grid;grid-template-columns:160px 1fr 140px;align-items:center;gap:14px;padding:6px 0;font-size:12.5px;color:var(--ttl-deep-muted)}
.ttl-cbar i{display:block;height:10px;border-radius:5px;background:rgba(255,255,255,.22)}
.ttl-cbar b{text-align:right;font-weight:400;color:var(--ttl-deep-ink);font-variant-numeric:tabular-nums}
.ttl-cbar-us i{background:var(--ttl-gold)}
.ttl-price .ttl-fine{color:var(--ttl-deep-muted);margin-top:10px}

/* faq */
.ttl-faq-title{margin-bottom:48px}
.ttl-faq-list{border-top:1px solid var(--ttl-rule);max-width:860px}
.ttl-faq-list li{border-bottom:1px solid var(--ttl-rule)}
.ttl-faq-list button{display:flex;justify-content:space-between;align-items:center;gap:20px;width:100%;padding:18px 0;text-align:left;font-size:15px;transition:color .2s;cursor:pointer}
.ttl-faq-list button:hover{color:var(--ttl-gold)}
.ttl-faq-list p{padding:0 48px 20px 0;color:var(--ttl-muted);max-width:700px;line-height:1.6}
.ttl-faq-more{margin-top:20px}
.ttl-faq-more a{text-decoration:underline;text-underline-offset:3px;color:var(--ttl-ink)}

/* cta */
.ttl-cta-sec{padding-top:40px;padding-bottom:40px}
.ttl-cta{position:relative;overflow:hidden;border-radius:10px;min-height:360px;display:flex;align-items:center;background:linear-gradient(120deg,var(--ttl-glow-a),var(--ttl-glow-b) 55%,var(--ttl-glow-c));transform-origin:50% 100%}
.ttl-blob{position:absolute;border-radius:50%;filter:blur(50px);pointer-events:none;will-change:transform}
.ttl-blob-a{width:520px;height:520px;left:-120px;top:-180px;background:var(--ttl-glow-a)}
.ttl-blob-b{width:460px;height:460px;right:-80px;bottom:-200px;background:var(--ttl-glow-b)}
.ttl-blob-c{width:300px;height:300px;right:28%;top:-90px;background:rgba(255,255,255,.55)}
.ttl-grain{position:absolute;inset:0;opacity:.35;mix-blend-mode:soft-light;background-image:repeating-radial-gradient(circle at 17% 32%,rgba(0,0,0,.18) 0 1px,transparent 1px 3px),repeating-radial-gradient(circle at 73% 61%,rgba(255,255,255,.3) 0 1px,transparent 1px 4px);pointer-events:none}
.ttl-cta-in{position:relative;padding:48px;max-width:640px;display:flex;flex-direction:column;gap:16px}
.ttl-cta-in > p{color:color-mix(in srgb,var(--ttl-ink) 75%,transparent);max-width:460px;line-height:1.6}
.ttl-cta-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.ttl-morph{position:relative;display:flex;align-items:center;height:48px;width:156px;border-radius:999px;background:var(--ttl-accent);color:var(--ttl-accent-ink);transition:width .6s cubic-bezier(.7,0,.2,1),background-color .45s,box-shadow .3s;overflow:hidden}
.ttl-morph[data-open]{width:min(380px,calc(100vw - 96px));background:var(--ttl-paper);box-shadow:0 0 0 1px var(--ttl-rule),0 16px 32px -20px rgba(16,41,45,.5)}
.ttl-morph[data-bad]{box-shadow:0 0 0 2px #b3412e;animation:ttl-shake .4s}
@keyframes ttl-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.ttl-morph input{position:absolute;left:0;top:0;bottom:0;width:calc(100% - 52px);padding:0 0 0 20px;border:0;outline:0;background:none;color:var(--ttl-ink);font-size:14px;opacity:0;pointer-events:none;transition:opacity .3s}
.ttl-morph[data-open] input{opacity:1;pointer-events:auto;transition-delay:.3s}
.ttl-morph button{position:absolute;right:0;top:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:500;transition:left .6s cubic-bezier(.7,0,.2,1);cursor:pointer}
.ttl-morph[data-open] button{left:calc(100% - 46px);right:4px;top:4px;bottom:4px;border-radius:50%;background:var(--ttl-accent);color:var(--ttl-accent-ink)}
.ttl-morph-label{transition:opacity .2s}
.ttl-morph[data-open] .ttl-morph-label{opacity:0;position:absolute;pointer-events:none}
.ttl-morph-go{display:grid;place-items:center}
.ttl-morph:not([data-open]) .ttl-morph-go{display:none}
.ttl-spin{width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:ttl-rot .7s linear infinite}
@keyframes ttl-rot{to{transform:rotate(360deg)}}
.ttl-cta-done{display:flex;align-items:center;gap:10px;font-weight:500;margin-top:12px}
.ttl-btn-glass{height:48px}

.ttl-op-sec{padding-top:40px;padding-bottom:120px}
.ttl-op{position:relative;display:grid;grid-template-columns:1fr 340px;align-items:center;gap:40px;min-height:340px;padding:48px;border-radius:10px;background:var(--ttl-deep);color:var(--ttl-deep-ink);overflow:hidden}
.ttl-op .ttl-h2{font-size:clamp(26px,3.2vw,36px)}
.ttl-op-copy{display:flex;flex-direction:column;gap:16px;max-width:500px}
.ttl-op-copy p{color:var(--ttl-deep-muted);line-height:1.6}
.ttl-link-arrow{display:inline-flex;align-items:center;gap:8px;font-size:14px;text-decoration:underline;text-underline-offset:4px;text-decoration-color:color-mix(in srgb,var(--ttl-deep-ink) 35%,transparent);cursor:pointer}
.ttl-link-arrow svg{transition:transform .3s}
.ttl-link-arrow:hover svg{transform:translateX(4px)}
.ttl-op-art{display:grid;place-items:center}
.ttl-dial{width:300px;height:300px}

/* resources */
.ttl-res{padding-top:40px}
.ttl-res-title{font-size:clamp(24px,2.8vw,34px);max-width:780px;margin-bottom:40px}
.ttl-res-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.ttl-res-card{display:flex;flex-direction:column;border-radius:10px;overflow:hidden;background:var(--ttl-deep);color:var(--ttl-deep-ink);transition:translate .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s;cursor:pointer}
.ttl-res-card:hover{translate:0 -6px;box-shadow:0 30px 50px -30px rgba(16,41,45,.6)}
.ttl-res-thumb{height:170px;overflow:hidden;background:var(--ttl-paper);position:relative}
.ttl-res-cap{display:flex;flex-direction:column;justify-content:space-between;gap:28px;padding:16px;flex:1}
.ttl-res-cap b{font-weight:400;font-size:14px;line-height:1.35}
.ttl-res-cap span{display:flex;justify-content:space-between;align-items:center;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--ttl-deep-muted)}
.ttl-res-cap span svg{transition:transform .3s}
.ttl-res-card:hover .ttl-res-cap span svg{transform:translateX(4px);color:var(--ttl-gold)}

/* footer */
.ttl-foot{position:relative;padding:80px 0 0;border-top:1px solid var(--ttl-rule);overflow:hidden}
.ttl-foot-grid{display:grid;grid-template-columns:1.3fr repeat(5,1fr);gap:24px;align-items:start}
.ttl-foot-col{display:flex;flex-direction:column;gap:8px;font-size:13px}
.ttl-foot-col b{font-weight:500;margin-bottom:6px}
.ttl-foot-col a{color:var(--ttl-muted);transition:color .2s;width:max-content}
.ttl-foot-col a:hover{color:var(--ttl-ink)}
.ttl-foot-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:64px;padding:18px 0;border-top:1px solid var(--ttl-rule);border-bottom:1px solid var(--ttl-rule);font-size:12px;color:var(--ttl-muted)}
.ttl-foot-legal-links{display:flex;flex-wrap:wrap;gap:16px}
.ttl-foot-legal-links a:hover{color:var(--ttl-ink)}
.ttl-social{display:flex;gap:8px}
.ttl-social a{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid var(--ttl-rule);color:var(--ttl-ink);transition:background-color .2s,color .2s}
.ttl-social a:hover{background:var(--ttl-ink);color:var(--ttl-page)}
.ttl-legal{font-size:11px;line-height:1.6;color:var(--ttl-muted);margin-top:18px;max-width:980px}
.ttl-bigmark{display:flex;justify-content:center;margin-top:40px;font-size:clamp(60px,16vw,240px);line-height:.78;letter-spacing:-.06em;font-weight:500;color:transparent;-webkit-text-stroke:1px color-mix(in srgb,var(--ttl-ink) 22%,transparent);overflow:hidden;padding-top:.06em;user-select:none}
.ttl-bigmark span{display:inline-block;background:linear-gradient(180deg,color-mix(in srgb,var(--ttl-gold) 30%,transparent),transparent 85%);-webkit-background-clip:text;background-clip:text}

/* narrow */
@media (max-width:1080px){
.ttl-float{right:-8px}
.ttl-float-2{left:-8px}
.ttl-foot-grid{grid-template-columns:repeat(3,1fr)}
.ttl-foot-grid > .ttl-brand{grid-column:1 / -1}
}
@media (max-width:900px){
.ttl-nav-links{display:none}
.ttl-burger{display:grid}
.ttl-hide-sm{display:none}
.ttl-sheet{display:flex;flex-direction:column;position:absolute;left:12px;right:12px;top:calc(100% + 4px);padding:8px;border-radius:16px;background:var(--ttl-paper);border:1px solid var(--ttl-rule);box-shadow:0 30px 60px -30px rgba(16,41,45,.4);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .25s,transform .35s cubic-bezier(.2,.8,.2,1),visibility .25s}
.ttl-sheet[data-open]{opacity:1;visibility:visible;transform:none}
.ttl-sheet a{display:flex;justify-content:space-between;align-items:center;padding:14px 12px;border-radius:10px;font-size:15px}
.ttl-sheet a:hover{background:var(--ttl-page)}
.ttl-split{grid-template-columns:1fr;gap:20px}
.ttl-sec{padding:84px 0}
.ttl-floats{position:relative;inset:auto;display:flex;justify-content:center;flex-wrap:wrap;margin-top:18px;gap:10px}
.ttl-float,.ttl-float-2{position:relative;inset:auto}
.ttl-feat-grid{grid-template-columns:1fr;gap:0}
.ttl-stage-col{display:none}
.ttl-feat{min-height:0;opacity:1;padding:24px 0 48px}
.ttl-feat-inline{display:block;position:relative;height:420px;border-radius:14px;overflow:hidden;background:var(--ttl-paper);margin-bottom:12px}
.ttl-feat[data-feat="1"] .ttl-feat-inline{background:color-mix(in srgb,var(--ttl-paper) 92%,var(--ttl-gold) 8%);border:1px solid var(--ttl-rule)}
.ttl-root[data-dark] .ttl-feat[data-feat="1"] .ttl-feat-inline{background:var(--ttl-deep);border-color:transparent}
.ttl-cov-items{grid-template-columns:repeat(2,1fr)}
.ttl-cov-item:nth-child(3){padding-left:0;border-left:0}
.ttl-cov-calc{grid-template-columns:1fr;gap:28px;padding:22px}
.ttl-op{grid-template-columns:1fr;padding:32px}
.ttl-op-art{order:-1}
.ttl-res-grid{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:720px){
.ttl-dash{grid-template-columns:1fr;height:auto;min-height:540px}
.ttl-side{display:none}
.ttl-main{padding:14px}
.ttl-tabs-sm{display:flex;gap:4px;margin-top:12px;padding:3px;border-radius:999px;background:var(--ttl-page);border:1px solid var(--ttl-rule)}
.ttl-tabs-sm button{flex:1;padding:6px 4px;border-radius:999px;font-size:12px;color:var(--ttl-muted)}
.ttl-tabs-sm button[aria-selected="true"]{background:var(--ttl-paper);color:var(--ttl-ink);box-shadow:0 1px 2px rgba(16,41,45,.12)}
.ttl-ov-head{flex-direction:column;gap:12px}
.ttl-spark{max-width:none;width:100%;align-items:stretch}
.ttl-spark .ttl-seg{align-self:flex-start}
.ttl-accs{grid-template-columns:1fr}
.ttl-acc{flex-direction:row;flex-wrap:wrap;align-items:center;gap:4px 12px}
.ttl-acc-top{flex:1}
.ttl-acc-kind{width:100%}
.ttl-pick{grid-template-columns:1fr}
.ttl-swap-icon{margin:0 auto;transform:rotate(90deg)}
.ttl-ledger li{grid-template-columns:52px 1fr auto;font-size:12px}
.ttl-led-status{display:none}
.ttl-stats{grid-template-columns:1fr;gap:28px;margin-top:56px}
.ttl-cov-items{grid-template-columns:1fr}
.ttl-cov-item + .ttl-cov-item{padding-left:0;border-left:0;border-top:1px solid var(--ttl-rule)}
.ttl-cov-out{grid-template-columns:1fr 1fr}
.ttl-dots{grid-template-columns:repeat(25,1fr);gap:3px}
.ttl-cta-in{padding:28px}
.ttl-op{padding:24px}
.ttl-dial{width:240px;height:240px}
.ttl-res-grid{grid-template-columns:1fr}
.ttl-cbar{grid-template-columns:110px 1fr 90px;gap:8px}
.ttl-foot-grid{grid-template-columns:1fr 1fr}
.ttl-foot-bar{flex-direction:column;align-items:flex-start}
.ttl-flow{width:min(300px,calc(100vw - 48px))}
.ttl-device-wrap{padding:0 12px;margin-top:44px}
.ttl-device-bezel{padding:6px;border-radius:16px}
}

@media (prefers-reduced-motion:reduce){
.ttl-root *,.ttl-root *::before,.ttl-root *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;transition-delay:0ms!important}
}
`
