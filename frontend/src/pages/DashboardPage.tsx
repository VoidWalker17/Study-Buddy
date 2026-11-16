import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircleDot, Bot, ListFilter,
  Plus, ChevronRight,
  Send, Mic, MicOff,
  LogOut, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface DashboardPageProps {
  onStartSession: (sessionData?: any) => void;
  onLogout: () => void;
}

interface ConceptItem {
  id: string;
  name: string;
  score: number;
  subtext: string;
  color: string;
  dotColor: string;
}

interface DialogueItem {
  id: string;
  time: string;
  text: string;
  speaker: 'user' | 'child' | 'teacher';
  tag: string;
  tagColor: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartSession,
  onLogout,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<'neural-state' | 'teach-agent' | 'dialogue-stream' | 'history'>('neural-state');
  const [timeFilter, setTimeFilter] = useState<'10m' | '24h' | '30d'>('24h');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('c3');

  // Interactive inline teaching box
  const [inlineExplanation, setInlineExplanation] = useState('');
  const [isSubmittingExplanation, setIsSubmittingExplanation] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Sessions and analytics from backend
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active concepts data (matching the high-aesthetic design in Image 2)
  const concepts: ConceptItem[] = [
    {
      id: 'c1',
      name: 'Quantum Superposition',
      score: 96.2,
      subtext: 'Wavefunction Collapse · Hilbert Space',
      color: isDark ? 'text-zinc-200' : 'text-[#12181a]',
      dotColor: '#12181a',
    },
    {
      id: 'c2',
      name: 'Entropy & Microstates',
      score: 86.1,
      subtext: 'Statistical Mechanics · Boltzmann Law',
      color: 'text-[#c2983b]',
      dotColor: '#c2983b',
    },
    {
      id: 'c3',
      name: 'Neural Attention Mechanics',
      score: 83.8,
      subtext: 'Transformer Multi-Head Projections',
      color: 'text-[#8285f2]',
      dotColor: '#8285f2',
    },
  ];

  // Pedagogical dialogue stream items (matching Image 2)
  const [dialogueStream, setDialogueStream] = useState<DialogueItem[]>([
    {
      id: 'd1',
      time: 'Just now',
      speaker: 'user',
      text: 'Explanation transmitted: "A photon doesn\'t travel along a single path; instead, it explores all trajectories simultaneously until measured."',
      tag: '+Depth',
      tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'd2',
      time: 'Just now',
      speaker: 'child',
      text: 'Child Agent asked: "Why can\'t wavefunctions collapse backwards if physical laws are time-reversible?"',
      tag: '+Depth',
      tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'd3',
      time: '10m ago',
      speaker: 'user',
      text: 'Student explained using double-slit interference analogy and wavepacket dispersion.',
      tag: 'Verified',
      tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'd4',
      time: '25m ago',
      speaker: 'teacher',
      text: 'Teacher Agent formulated cold baseline exam (5 conceptual probes with blind evaluation).',
      tag: 'Cold Baseline',
      tagColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/sessions/history');
        if (res.data?.sessions && res.data.sessions.length > 0) {
          setSessions(res.data.sessions);
        } else {
          setSessions([
            {
              id: 'ses_quantum_401',
              title: 'Advanced Quantum Mechanics • PHYS 401',
              subject: 'Physics',
              baseline_score: 12.0,
              final_score: 94.0,
              tes_score: 88.7,
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: 'ses_thermo_302',
              title: 'Statistical Thermodynamics & Microstates',
              subject: 'Physical Chemistry',
              baseline_score: 18.0,
              final_score: 91.5,
              tes_score: 86.1,
              created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
            {
              id: 'ses_transformer_ai',
              title: 'Transformer Attention & Multi-Head Projections',
              subject: 'Deep Learning',
              baseline_score: 15.0,
              final_score: 95.0,
              tes_score: 83.8,
              created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.warn('Dashboard fallback to local sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle submitting an explanation inline
  const handleSendInlineExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineExplanation.trim()) return;

    const userText = inlineExplanation.trim();
    setInlineExplanation('');
    setIsSubmittingExplanation(true);

    // Add user explanation to stream
    const userItem: DialogueItem = {
      id: 'd_' + Date.now(),
      time: 'Just now',
      speaker: 'user',
      text: `Explanation transmitted: "${userText}"`,
      tag: '+Depth',
      tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };

    setDialogueStream((prev) => [userItem, ...prev]);

    // Simulate instant Child Agent inquiry
    setTimeout(() => {
      const childItem: DialogueItem = {
        id: 'd_child_' + Date.now(),
        time: 'Just now',
        speaker: 'child',
        text: `Child Agent inquiry: "I see! So if ${userText.slice(0, 32)}..., does that mean the energy distribution changes when observed?"`,
        tag: '+Synthesis',
        tagColor: 'bg-[#8285f2]/10 text-[#8285f2] border-[#8285f2]/20',
      };
      setDialogueStream((prev) => [childItem, ...prev]);
      setIsSubmittingExplanation(false);
    }, 900);
  };

  const studentName = user?.name || 'Divyansh Agarwal';

  // Retention curve SVG points depending on timeFilter
  const getCurveData = () => {
    if (timeFilter === '10m') {
      return {
        path: 'M 0,85 Q 40,82 80,78 T 160,70 T 240,55 T 320,40 T 380,25 L 380,100 L 0,100 Z',
        stroke: 'M 0,85 Q 40,82 80,78 T 160,70 T 240,55 T 320,40 T 380,25',
        tes: '88.7%',
        delta: '+91.8%',
      };
    }
    if (timeFilter === '24h') {
      return {
        path: 'M 0,90 Q 50,85 100,75 T 200,60 T 280,42 T 340,32 T 380,22 L 380,100 L 0,100 Z',
        stroke: 'M 0,90 Q 50,85 100,75 T 200,60 T 280,42 T 340,32 T 380,22',
        tes: '88.7%',
        delta: '+91.8%',
      };
    }
    return {
      path: 'M 0,94 Q 60,90 120,78 T 220,58 T 300,38 T 380,18 L 380,100 L 0,100 Z',
      stroke: 'M 0,94 Q 60,90 120,78 T 220,58 T 300,38 T 380,18',
      tes: '92.4%',
      delta: '+94.2%',
    };
  };

  const curve = getCurveData();

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#090f11] text-[#eef2f1]' : 'bg-[#faf8f5] text-[#12181a]'
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Left Sidebar (Matching Image 2 Aesthetic)                  */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`w-64 shrink-0 hidden md:flex flex-col justify-between border-r transition-colors duration-300 ${
          isDark
            ? 'bg-[#0b1316] border-zinc-800/80'
            : 'bg-[#ffffff] border-[#eae6dc]'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Header: Study Buddy Neural */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-[#12181a] dark:bg-white flex items-center justify-center text-white dark:text-[#12181a] shadow-sm">
              <CircleDot className="w-4 h-4 text-[#c2983b]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight">
                Study Buddy Neural
              </span>
              <span className="text-[10px] text-[#7a8482] font-mono tracking-wider uppercase">
                Cognitive Studio
              </span>
            </div>
          </div>

          {/* Section: WORKSPACE */}
          <div className="space-y-1.5">
            <div className="px-2 pb-1 text-[11px] font-mono uppercase tracking-widest text-[#8a9492] font-semibold">
              Workspace
            </div>

            {/* Neural State Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('neural-state')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'neural-state'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'bg-[#ffffff] text-[#12181a] font-semibold shadow-xs border border-[#e5e1d5]'
                  : 'text-[#6e7775] hover:text-[#12181a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5 text-[#c2983b]" />
              <span>Neural State</span>
            </button>

            {/* Teach Agent Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('teach-agent');
                onStartSession({
                  title: 'Advanced Quantum Mechanics • PHYS 401',
                  subject: 'Physics',
                });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'teach-agent'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'bg-[#ffffff] text-[#12181a] font-semibold shadow-xs border border-[#e5e1d5]'
                  : 'text-[#6e7775] hover:text-[#12181a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#2b7a58]" />
              <span>Teach Agent</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                Live
              </span>
            </button>

            {/* Dialogue Stream Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('dialogue-stream')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'dialogue-stream'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'bg-[#ffffff] text-[#12181a] font-semibold shadow-xs border border-[#e5e1d5]'
                  : 'text-[#6e7775] hover:text-[#12181a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-[#8285f2]" />
              <span>Dialogue Stream</span>
            </button>

            {/* Session History Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'history'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'bg-[#ffffff] text-[#12181a] font-semibold shadow-xs border border-[#e5e1d5]'
                  : 'text-[#6e7775] hover:text-[#12181a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#c2983b]" />
              <span>Session History</span>
              {sessions.length > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 font-mono">
                  {sessions.length}
                </span>
              )}
            </button>
          </div>

          {/* Section: ACTIVE CONCEPTS */}
          <div className="space-y-2 pt-2 border-t border-[#ede9e0] dark:border-zinc-800/80">
            <div className="px-2 text-[11px] font-mono uppercase tracking-widest text-[#8a9492] font-semibold">
              Active Concepts
            </div>

            <div className="space-y-1">
              {concepts.map((concept) => {
                const isSelected = selectedConceptId === concept.id;
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-zinc-800/80 text-white font-medium border border-zinc-700'
                          : 'bg-[#f7f5ed] text-[#12181a] font-semibold border border-[#e4dfd2]'
                        : 'text-[#6e7775] hover:text-[#12181a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: concept.dotColor }}
                      />
                      <span className="truncate">{concept.name}</span>
                    </div>
                    <span className="text-[11px] font-mono font-medium ml-2 shrink-0 opacity-90">
                      {concept.score}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: PEDAGOGICAL GATES & CERTIFICATIONS */}
          <div className="space-y-2 pt-2 border-t border-[#ede9e0] dark:border-zinc-800/80">
            <div className="px-2 text-[11px] font-mono uppercase tracking-widest text-[#8a9492] font-semibold">
              Pedagogical Proof
            </div>

            <div className="p-3 rounded-xl bg-[#0a1c1e] text-[#eef2f1] space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Agent Verification</span>
                <span className="text-emerald-400 font-mono font-semibold">92.5% Final</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '92.5%' }} />
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                <span>Blind Exam Gate</span>
                <span className="text-[#c2983b] font-mono">Verified Delta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-4 border-t border-[#ede9e0] dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-[#12181a] text-white dark:bg-white dark:text-[#12181a] flex items-center justify-center text-xs font-bold">
                {studentName.charAt(0)}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold truncate leading-tight">
                  {studentName}
                </div>
                <div className="text-[10px] text-[#7a8482] font-mono">
                  Scholar Tier
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#7a8482] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. Main Content Area                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header */}
        <header
          className={`sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b backdrop-blur-md transition-colors relative ${
            isDark
              ? 'bg-[#090f11]/90 border-zinc-800/80'
              : 'bg-[#faf8f5]/90 border-[#eae6dc]'
          }`}
        >
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c2983b] via-[#8285f2] to-[#2b7a58] animate-pulse" />
          )}

          {/* Left: Breadcrumbs + Live Indicator */}
          <div className="flex items-center gap-3 truncate">
            <div className="text-xs font-medium text-[#6e7775] dark:text-zinc-400 flex items-center gap-1.5">
              <span>Neural Studio</span>
              <span>/</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                Advanced Quantum Mechanics • PHYS 401
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live LPU Inference
            </div>
          </div>

          {/* Right: Architecture Pill + New Session Button + Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <span className="text-[#c2983b] font-medium">Teacher Agent (120B)</span>
              <span className="text-zinc-400">→</span>
              <span className="text-[#8285f2] font-medium">Child Agent (20B)</span>
            </div>

            <button
              type="button"
              onClick={() => onStartSession()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#12181a] hover:bg-black text-white dark:bg-white dark:text-[#12181a] dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* Main Body Grid */}
        <main className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          {activeTab === 'neural-state' && (
            <>
              {/* ========================================================= */}
              {/* HERO SECTION: Neural Retention State (Image 2 Top)        */}
              {/* ========================================================= */}
              <section
                className={`p-6 md:p-8 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-[#0e171a] border-zinc-800 shadow-sm'
                    : 'bg-[#ffffff] border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
                }`}
              >
                {/* Header: Title + Time Toggle Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                      Neural Retention State
                    </h1>
                    <div className={`text-[11px] font-mono uppercase tracking-wider mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#7a8482]'}`}>
                      Teaching Efficiency Score (TES)
                    </div>
                  </div>

                  {/* Segmented Time Control: 10m / 24h / 30d */}
                  <div
                    className={`inline-flex p-1 rounded-xl border text-xs font-medium self-start sm:self-auto ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        : 'bg-[#f4f2ea] border-[#e2decfa0] text-[#6e7775]'
                    }`}
                  >
                    {(['10m', '24h', '30d'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeFilter(t)}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          timeFilter === t
                            ? isDark
                              ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                              : 'bg-white text-[#12181a] font-semibold shadow-xs'
                            : 'hover:text-[#12181a] dark:hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metrics & Sparkline Graphic */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2">
                  {/* Left Score Block */}
                  <div className="md:col-span-5 space-y-2">
                    <div className={`text-4xl md:text-5xl font-extrabold tracking-tight font-serif ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                      {curve.tes}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2b7a58] dark:text-emerald-400">
                      <span className="font-semibold">{curve.delta} Permanent</span>
                      <span className={`font-normal ${isDark ? 'text-zinc-400' : 'text-[#7a8482]'}`}>
                        vs. Cold Baseline Exam
                      </span>
                    </div>
                  </div>

                  {/* Right Smooth Retention Trajectory Area Curve */}
                  <div className="md:col-span-7 h-28 relative flex items-end">
                    <svg
                      viewBox="0 0 380 100"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c2983b" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#c2983b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Subtle Grid reference line */}
                      <line
                        x1="0"
                        y1="85"
                        x2="380"
                        y2="85"
                        stroke={isDark ? '#27272a' : '#ece9e0'}
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      {/* Area fill */}
                      <path d={curve.path} fill="url(#curveGrad)" />
                      {/* Smooth line */}
                      <path
                        d={curve.stroke}
                        fill="none"
                        stroke="#c2983b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* End target pulse node */}
                      <circle cx="380" cy="22" r="4.5" fill="#c2983b" />
                      <circle cx="380" cy="22" r="8" fill="#c2983b" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </section>

              {/* ========================================================= */}
              {/* CONCEPTS ROW: 3 Cards Side-by-Side (Image 2 Middle)       */}
              {/* ========================================================= */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {concepts.map((concept) => {
                  const isSelected = selectedConceptId === concept.id;
                  return (
                    <div
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? isDark
                            ? 'bg-[#101b1e] border-[#c2983b] ring-1 ring-[#c2983b]/30 shadow-md'
                            : 'bg-[#ffffff] border-[#c2983b] ring-1 ring-[#c2983b]/30 shadow-sm'
                          : isDark
                          ? 'bg-[#0d1619] border-zinc-800/80 hover:border-zinc-700'
                          : 'bg-[#ffffff] border-[#eae6dc] hover:border-[#ded9cb]'
                      }`}
                    >
                      {/* Top Concept Name with colored bullet */}
                      <div className="flex items-center gap-2 text-xs text-[#6e7775] dark:text-zinc-400 mb-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: concept.dotColor }}
                        />
                        <span className="truncate font-medium">{concept.name}</span>
                      </div>

                      {/* Score */}
                      <div className={`text-2xl font-bold tracking-tight mb-1.5 ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                        {concept.score}%
                      </div>

                      {/* Hierarchy / Subtext */}
                      <div className={`text-[11px] font-mono truncate ${isDark ? 'text-zinc-400' : 'text-[#7a8482]'}`}>
                        {concept.subtext}
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* ========================================================= */}
              {/* PEDAGOGICAL DIALOGUE STREAM (Image 2 Feed)                */}
              {/* ========================================================= */}
              <section
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  isDark
                    ? 'bg-[#0e171a] border-zinc-800 shadow-sm'
                    : 'bg-[#ffffff] border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#ede9e0] dark:border-zinc-800/80 pb-3">
                  <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                    Pedagogical Dialogue Stream
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dialogue-stream')}
                    className="text-xs text-[#6e7775] hover:text-[#12181a] dark:text-zinc-400 dark:hover:text-white inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>View full transcript</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Feed List */}
                <div className="space-y-3 pt-1">
                  {dialogueStream.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 text-xs py-2 border-b border-[#f4f2ea] dark:border-zinc-800/50 last:border-0"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-[11px] font-mono text-[#8a9492] shrink-0 w-16 pt-0.5">
                          {item.time}
                        </span>
                        <span className="text-[#2a3432] dark:text-zinc-200 leading-relaxed">
                          {item.text}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium shrink-0 border ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Socratic Testing Input: Teach child agent inline */}
                <form
                  onSubmit={handleSendInlineExplanation}
                  className="pt-3 mt-2 flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inlineExplanation}
                      onChange={(e) => setInlineExplanation(e.target.value)}
                      placeholder="Explain a concept simply to the child agent (e.g. why wavefunctions collapse)..."
                      className={`w-full py-2 pl-3.5 pr-10 rounded-xl text-xs border transition-all focus:outline-none focus:ring-1 focus:ring-[#c2983b] ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500'
                          : 'bg-[#faf8f5] border-[#eae6dc] text-[#12181a] placeholder-[#8a9492]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsListening(!isListening)}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-xs cursor-pointer ${
                        isListening ? 'text-red-500 animate-pulse' : 'text-[#7a8482] hover:text-[#12181a]'
                      }`}
                      title={isListening ? 'Stop Mic' : 'Voice Input'}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inlineExplanation.trim() || isSubmittingExplanation}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#12181a] text-white hover:bg-black dark:bg-white dark:text-[#12181a] dark:hover:bg-zinc-200 disabled:opacity-40 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Transmit</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </section>

              {/* ========================================================= */}
              {/* COGNITIVE MASTERY BREAKDOWN (Image 2 Bottom)               */}
              {/* ========================================================= */}
              <section
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  isDark
                    ? 'bg-[#0d1619] border-zinc-800/80 shadow-xs'
                    : 'bg-[#ffffff] border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
                }`}
              >
                <div>
                  <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#12181a]'}`}>
                    Cognitive Mastery Breakdown
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#7a8482]'}`}>
                    Intuitive Analogy (42%) · Mathematical Rigor (38%) · Boundary Resilience (20%)
                  </p>
                </div>

                {/* Segmented Horizontal Progress Bar (Charcoal / Gold / Lavender) */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#f0ede4] dark:bg-zinc-800">
                  <div
                    style={{ width: '36%' }}
                    className="bg-[#12181a] dark:bg-zinc-300 h-full"
                    title="Quantum Superposition: 36%"
                  />
                  <div
                    style={{ width: '32%' }}
                    className="bg-[#c2983b] h-full"
                    title="Entropy & Microstates: 32%"
                  />
                  <div
                    style={{ width: '32%' }}
                    className="bg-[#8285f2] h-full"
                    title="Neural Attention Mechanics: 32%"
                  />
                </div>

                {/* Legend Row */}
                <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#12181a] dark:bg-zinc-300" />
                    <span className={isDark ? 'text-zinc-300' : 'text-[#6e7775]'}>
                      <strong className={isDark ? 'text-white' : 'text-[#12181a]'}>36%</strong> Quantum Superposition
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c2983b]" />
                    <span className={isDark ? 'text-zinc-300' : 'text-[#6e7775]'}>
                      <strong className={isDark ? 'text-white' : 'text-[#12181a]'}>32%</strong> Entropy & Microstates
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8285f2]" />
                    <span className={isDark ? 'text-zinc-300' : 'text-[#6e7775]'}>
                      <strong className={isDark ? 'text-white' : 'text-[#12181a]'}>32%</strong> Neural Attention Mechanics
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ========================================================= */}
          {/* DIALOGUE STREAM EXPANDED TAB VIEW                         */}
          {/* ========================================================= */}
          {activeTab === 'dialogue-stream' && (
            <div
              className={`p-6 md:p-8 rounded-2xl border transition-all space-y-6 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800/80 shadow-xs'
                  : 'bg-[#ffffff] border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#ede9e0] dark:border-zinc-800/80 pb-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#12181a] dark:text-white">
                    Pedagogical Dialogue Stream & Transcripts
                  </h1>
                  <p className="text-xs text-[#7a8482] dark:text-zinc-400 mt-1">
                    Continuous Socratic exchange between Teacher Evaluator (120B) and Child Agent (20B).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('neural-state')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#eae6dc] dark:border-zinc-700 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  ← Back to Neural State
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {dialogueStream.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-[#ede9e0] dark:border-zinc-800/80 bg-[#faf8f5]/60 dark:bg-zinc-900/40 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#8a9492]">
                          {item.time}
                        </span>
                        <span className="text-[11px] font-semibold text-[#12181a] dark:text-white uppercase font-mono">
                          {item.speaker === 'user'
                            ? 'Scholar Explanation'
                            : item.speaker === 'child'
                            ? 'Child Agent (20B)'
                            : 'Teacher Evaluator (120B)'}
                        </span>
                      </div>
                      <p className="text-xs text-[#2a3432] dark:text-zinc-200 leading-relaxed font-sans">
                        {item.text}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium shrink-0 border ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SESSION HISTORY TAB VIEW                                  */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div
              className={`p-6 md:p-8 rounded-2xl border transition-all space-y-6 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800/80 shadow-xs'
                  : 'bg-[#ffffff] border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#ede9e0] dark:border-zinc-800/80 pb-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#12181a] dark:text-white">
                    Feynman Session History & Records
                  </h1>
                  <p className="text-xs text-[#7a8482] dark:text-zinc-400 mt-1">
                    Audited cold baseline vs. blind final exams with Teaching Efficiency Scores (TES).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('neural-state')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#eae6dc] dark:border-zinc-700 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  ← Back to Neural State
                </button>
              </div>

              <div className="divide-y divide-[#ede9e0] dark:divide-zinc-800/80">
                {sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-[#12181a] dark:text-white">
                        {ses.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#7a8482] dark:text-zinc-400">
                        <span>{ses.subject || 'General'}</span>
                        <span>•</span>
                        <span>Baseline: {ses.baseline_score || 12}%</span>
                        <span>•</span>
                        <span>Final: {ses.final_score || 92}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#c2983b] font-mono">
                          TES {ses.tes_score || 85}%
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Verified Retention
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onStartSession(ses)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#12181a] text-white hover:bg-black dark:bg-white dark:text-[#12181a] dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
                      >
                        Resume →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
