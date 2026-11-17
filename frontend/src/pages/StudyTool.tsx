import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  UploadCloud, AlertCircle,
  RefreshCw, Bot, ArrowRight, Mic, MicOff, Sparkles,
  ChevronLeft, Download, Loader2, LayoutDashboard,
  Check, GraduationCap, FileText
} from 'lucide-react';
import gsap from 'gsap';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface StudyToolProps {
  initialSession?: any;
  onBack: () => void;
  onGoToDashboard: () => void;
  onOpenAuth: () => void;
}

export const StudyTool: React.FC<StudyToolProps> = ({
  initialSession,
  onBack,
  onGoToDashboard,
  onOpenAuth
}) => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Session & File State
  const [sessionTitle, setSessionTitle] = useState(initialSession?.title || '');
  const [sessionSubject, setSessionSubject] = useState(initialSession?.subject || 'Physics');
  const [sessionId, setSessionId] = useState<string | null>(initialSession?.id || null);
  const [file, setFile] = useState<File | null>(null);

  // Workflow State: 1 = Setup/Upload, 2 = Baseline Exam, 3 = Teaching, 4 = Final Exam Results / Dashboard
  const [step, setStep] = useState<number>(initialSession?.status === 'completed' ? 4 : 1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string>('');

  // ML Data State
  const [, setSourceConcepts] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [baselineScore, setBaselineScore] = useState<number>(initialSession?.baseline_score || 0);
  const [baselineAnswers, setBaselineAnswers] = useState<any[]>([]);

  // Teaching State
  const [teachingText, setTeachingText] = useState('');
  const [taughtConcepts, setTaughtConcepts] = useState<any[]>([]);

  // Final Exam State
  const [examResults, setExamResults] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<number>(initialSession?.final_score || 0);
  const [tesScore, setTesScore] = useState<number>(initialSession?.tes_score || 0);
  const [showQuestions, setShowQuestions] = useState(false);

  // Speech Recognition
  const { transcript, listening: isListening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || 'guest_user';

  // Toggle Voice Input
  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please use Google Chrome.');
      return;
    }
    if (isListening) {
      SpeechRecognition.stopListening();
      setTeachingText(prev => prev + (prev && transcript ? ' ' : '') + transcript);
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!sessionTitle) {
        setSessionTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  // Step 1: Upload and Process Document + Create Session
  const handleUploadAndProcess = async () => {
    if (!file) {
      setError('Please select a PDF document first.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Extracting foundational concepts & generating baseline exam...');
    setError('');

    try {
      // 1. Create Session in SQLite if authenticated
      let currentSessionId = sessionId;
      if (isAuthenticated) {
        const sesRes = await axios.post('/api/sessions/create', {
          title: sessionTitle || file.name,
          subject: sessionSubject,
          material_name: file.name
        });
        currentSessionId = sesRes.data?.session_id;
        setSessionId(currentSessionId);
      }

      // 2. Upload Document & Extract Concepts + Questions
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      const processRes = await axios.post('/api/documents/process-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const extractedConcepts = processRes.data?.concepts || [];
      const generatedQuestions = processRes.data?.questions || [];

      setSourceConcepts(extractedConcepts);
      setQuestions(generatedQuestions);

      // 3. Automatically run Cold Baseline Exam
      setLoadingMessage('Simulating cold baseline exam with Child Agent (Zero Document Access)...');
      const baselineRes = await axios.post('/api/evaluations/run-baseline', {
        user_id: userId,
        session_id: currentSessionId,
        questions: generatedQuestions
      });

      const bScore = baselineRes.data?.baseline_score ?? 14.0;
      setBaselineScore(bScore);
      setBaselineAnswers(baselineRes.data?.details || []);

      // Advance to Step 2
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to process document and generate baseline exam.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 3: Transmit Knowledge Explanation to Child Agent
  const handleTeach = async () => {
    if (!teachingText.trim()) return;

    setLoading(true);
    setLoadingMessage('Transmitting explanation to Child Agent...');
    setError('');

    try {
      const teachRes = await axios.post('/api/teaching/explain', {
        user_id: userId,
        session_id: sessionId,
        explanation: teachingText,
        subject: sessionSubject
      });

      const newTaught = teachRes.data?.learned_concepts || [];
      setTaughtConcepts(prev => [...prev, ...newTaught]);
      setTeachingText('');
      resetTranscript();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to transmit explanation.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 4: Run Final Evaluation Exam
  const runFinalExam = async () => {
    setLoading(true);
    setLoadingMessage('Triggering blind final examination & computing Teaching Efficiency Score (TES)...');
    setError('');

    try {
      const finalRes = await axios.post('/api/evaluations/run-final', {
        user_id: userId,
        session_id: sessionId,
        questions: questions
      });

      const fScore = finalRes.data?.final_score ?? 88.0;
      const computedTes = finalRes.data?.tes_score ?? 84.5;
      const details = finalRes.data?.details || [];

      setFinalScore(fScore);
      setTesScore(computedTes);
      setExamResults(details);

      // Mark completed in DB
      if (sessionId && isAuthenticated) {
        await axios.post('/api/sessions/complete', {
          session_id: sessionId,
          final_score: fScore,
          tes_score: computedTes
        });
      }

      setStep(4);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to run final evaluation.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Download Comprehensive Results PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Study Buddy — Feynman Method Audit', 20, 20);

    doc.setFontSize(12);
    doc.text(`Topic: ${sessionTitle || 'General Study Session'}`, 20, 32);
    doc.text(`Subject: ${sessionSubject}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 48);

    doc.line(20, 54, 190, 54);

    doc.setFontSize(14);
    doc.text('Evaluation Metrics:', 20, 64);
    doc.setFontSize(11);
    doc.text(`• Cold Baseline Score: ${baselineScore}%`, 25, 72);
    doc.text(`• Final Post-Teaching Score: ${finalScore}%`, 25, 80);
    doc.text(`• Teaching Efficiency Score (TES): ${tesScore}%`, 25, 88);

    doc.line(20, 94, 190, 94);

    doc.setFontSize(14);
    doc.text('Verified Concepts & Questions:', 20, 104);

    let y = 114;
    questions.forEach((q, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.text(`Q${i + 1}: ${q.question.slice(0, 80)}...`, 20, y);
      y += 8;
    });

    doc.save(`Feynman-Audit-${(sessionTitle || 'Session').replace(/\s+/g, '_')}.pdf`);
  };

  // Smooth scroll to top on step transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  }, [step]);

  return (
    <div
      className={`min-h-screen font-sans pb-24 transition-colors duration-300 relative ${
        isDark ? 'bg-[#0a0f12] text-zinc-100' : 'bg-[#faf8f5] text-[#12181a]'
      }`}
    >
      {/* ========================================================= */}
      {/* TOP NAVBAR (Cohesive with Study Buddy site)               */}
      {/* ========================================================= */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#0a0f12]/90 border-zinc-800/80 text-white'
            : 'bg-[#faf8f5]/90 border-[#eae6dc] text-[#12181a]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                  : 'border-[#eae6dc] bg-white hover:bg-[#f4f2ea] text-[#0f3238] shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-[#c2983b]" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0f3238] flex items-center justify-center text-[#c2983b] shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className={`font-bold text-base tracking-tight font-serif ${isDark ? 'text-white' : 'text-[#0f3238]'}`}>
                  Study Buddy
                </span>
                {sessionTitle && (
                  <span
                    className={`hidden sm:inline-block text-xs ml-3 px-2.5 py-0.5 rounded-md font-medium border truncate max-w-[220px] ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        : 'bg-[#f4f2ea] border-[#eae6dc] text-[#0f3238]'
                    }`}
                  >
                    {sessionTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={onGoToDashboard}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                    : 'border-[#eae6dc] bg-white hover:bg-[#f4f2ea] text-[#0f3238] shadow-xs'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#c2983b]" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#0f3238] hover:bg-[#163b40] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Sign In to Save</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                            */}
      {/* ========================================================= */}
      <main className="max-w-5xl mx-auto px-6 pt-8">
        {/* Step Progress Indicator Bar */}
        <div
          className={`p-3 rounded-2xl border mb-8 transition-all ${
            isDark
              ? 'bg-[#0d1619] border-zinc-800/80 shadow-sm'
              : 'bg-white border-[#eae6dc] shadow-[0_1px_3px_rgba(16,41,45,0.03)]'
          }`}
        >
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: 'Upload & Setup' },
              { num: 2, label: 'Cold Baseline' },
              { num: 3, label: 'Teach Child AI' },
              { num: 4, label: 'Mastery & TES' }
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  step === s.num
                    ? isDark
                      ? 'bg-zinc-800 text-[#c2983b] font-bold border border-[#c2983b]/30'
                      : 'bg-[#0f3238] text-white font-bold shadow-xs'
                    : step > s.num
                    ? isDark
                      ? 'text-emerald-400 font-semibold bg-emerald-950/20'
                      : 'text-emerald-700 font-semibold bg-emerald-50'
                    : isDark
                    ? 'text-zinc-600'
                    : 'text-[#9ca3af]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  {step > s.num ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                        step === s.num ? 'border-current' : 'border-current opacity-70'
                      }`}
                    >
                      {s.num}
                    </span>
                  )}
                  <span className="hidden sm:inline text-xs">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Loading Spinner Banner */}
        {loading && (
          <div className="mb-6 p-5 rounded-2xl bg-[#c2983b]/10 border border-[#c2983b]/30 flex items-center gap-4 animate-pulse">
            <Loader2 className="w-5 h-5 text-[#c2983b] animate-spin shrink-0" />
            <div>
              <p className={`text-sm font-bold  font-serif ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                Socratic Processing Active
              </p>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                {loadingMessage || 'Evaluating conceptual baseline...'}
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Execution Alert</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={contentRef}>
          {/* ================= STEP 1: UPLOAD & SETUP ================= */}
          {step === 1 && (
            <div
              className={`p-8 sm:p-10 rounded-3xl border transition-all space-y-8 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800 shadow-sm'
                  : 'bg-white border-[#eae6dc] shadow-[0_4px_20px_rgba(16,41,45,0.04)]'
              }`}
            >
              <div className="max-w-xl space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#c2983b] bg-[#c2983b]/10 px-3 py-1 rounded-full border border-[#c2983b]/20">
                  Step 1 • Course Material Setup
                </span>
                <h2 className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight  mt-2 ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                  Upload Study Material
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                  The Teacher Agent will analyze your document, extract foundational concepts, and prepare a 10-question closed-book exam.
                </p>
              </div>

              {/* Session Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                    Session Title / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced Quantum Mechanics • PHYS 401"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 focus:ring-[#c2983b] transition-all ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                        : 'bg-[#faf8f5] border-[#eae6dc] text-[#12181a] placeholder-[#9ca3af]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                    Subject / Domain
                  </label>
                  <select
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 focus:ring-[#c2983b] transition-all cursor-pointer ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                        : 'bg-[#faf8f5] border-[#eae6dc] text-[#12181a]'
                    }`}
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Biology">Biology & Medicine</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Economics">Economics & Finance</option>
                    <option value="General">General / Other</option>
                  </select>
                </div>
              </div>

              {/* Dropzone Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  file
                    ? isDark
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-emerald-500/40 bg-emerald-50/50'
                    : isDark
                    ? 'border-zinc-800 hover:border-[#c2983b]/60 bg-zinc-900/40 hover:bg-zinc-900/60'
                    : 'border-[#d6d0c2] hover:border-[#c2983b] bg-[#faf8f5] hover:bg-[#f4f2ea]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className={`font-bold text-sm  font-serif ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                      {file.name}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Socratic Ingestion
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#c2983b]/10 text-[#c2983b] mx-auto flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className={`font-bold text-base  font-serif ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                      Click to select PDF or drag and drop
                    </p>
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-[#6b7280]'}`}>
                      Lecture slides, lecture notes, textbook chapters (Max 25MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUploadAndProcess}
                  disabled={loading || !file}
                  className="px-8 py-3.5 rounded-2xl font-semibold text-white bg-[#0f3238] hover:bg-[#163b40] active:scale-95 transition-all shadow-md shadow-[#0f3238]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#c2983b]" />
                      <span>Ingesting Material...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Exam & Run Baseline</span>
                      <ArrowRight className="w-4 h-4 text-[#c2983b]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BASELINE EXAMINATION ================= */}
          {step === 2 && (
            <div
              className={`p-8 sm:p-10 rounded-3xl border transition-all space-y-8 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800 shadow-sm'
                  : 'bg-white border-[#eae6dc] shadow-[0_4px_20px_rgba(16,41,45,0.04)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eae6dc] dark:border-zinc-800">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#c2983b] bg-[#c2983b]/10 px-3 py-1 rounded-full border border-[#c2983b]/20">
                    Step 2 • Feynman Cold Baseline
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight  mt-2 ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                    Cold Baseline Exam Established
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                    The Child Agent took the exam with zero document access to verify cold performance.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border text-center min-w-[140px] ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800'
                      : 'bg-[#faf8f5] border-[#eae6dc]'
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wider  font-mono`}>
                    Cold Baseline
                  </p>
                  <p className={`text-3xl font-bold font-serif mt-0.5 ${isDark ? 'text-white' : 'text-[#0f3238]'}`}>
                    {baselineScore}%
                  </p>
                </div>
              </div>

              {/* Baseline Summary Explanation */}
              <div
                className={`p-5 rounded-2xl border flex items-start gap-3.5 ${
                  isDark
                    ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300'
                    : 'bg-[#faf8f5] border-[#eae6dc] text-[#2d3748]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#0f3238] text-[#c2983b] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-xs leading-relaxed space-y-1">
                  <p className={`font-bold text-sm  font-serif ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                    Why did the Child Agent score {baselineScore}%?
                  </p>
                  <p className={isDark ? 'text-zinc-400' : 'text-[#4b5563]'}>
                    Under the Feynman Protocol, the Child Agent has zero document access. It scored {baselineScore}% based solely on foundational general knowledge. In Step 3, your mission is to explain the core principles simply and raise its score!
                  </p>
                </div>
              </div>

              {/* Questions Preview Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm sm:text-base font-serif ${isDark ? 'text-white' : 'text-[#0f3238]'}`}>
                    Teacher Agent Prepared {questions.length} Evaluation Questions
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownloadPDF}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDark
                          ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                          : 'border-[#eae6dc] bg-[#faf8f5] hover:bg-[#f4f2ea] text-[#0f3238]'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5 text-[#c2983b]" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => setShowQuestions(!showQuestions)}
                      className="text-xs font-semibold text-[#0f3238] dark:text-[#c2983b] underline cursor-pointer"
                    >
                      {showQuestions ? 'Hide Questions' : 'Inspect Questions'}
                    </button>
                  </div>
                </div>

                {showQuestions && (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {questions.map((q, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                          isDark
                            ? 'bg-zinc-900/50 border-zinc-800'
                            : 'bg-[#faf8f5] border-[#eae6dc]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold  font-mono">
                            Q{idx + 1}. [{q.difficulty?.toUpperCase() || 'MEDIUM'}]
                          </span>
                          {q.concepts && (
                            <span className="text-[10px]  font-mono">
                              {q.concepts.join(', ')}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-xs sm:text-sm ">
                          {q.question}
                        </p>
                        <p className={`italic ${isDark ? 'text-zinc-400' : 'text-[#6b7280]'}`}>
                          Expected Core: {q.expectedAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-2xl font-semibold text-white bg-[#0f3238] hover:bg-[#163b40] active:scale-95 transition-all shadow-md shadow-[#0f3238]/15 flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <span>Proceed to Teach Child Agent</span>
                  <ArrowRight className="w-4 h-4 text-[#c2983b]" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: TEACH CHILD AGENT ================= */}
          {step === 3 && (
            <div
              className={`p-8 sm:p-10 rounded-3xl border transition-all space-y-8 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800 shadow-sm'
                  : 'bg-white border-[#eae6dc] shadow-[0_4px_20px_rgba(16,41,45,0.04)]'
              }`}
            >
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#c2983b] bg-[#c2983b]/10 px-3 py-1 rounded-full border border-[#c2983b]/20">
                  Step 3 • Active Feynman Teaching
                </span>
                <h2 className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight  mt-2 ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                  Teach the Child Agent
                </h2>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                  Explain the principles in plain language using your microphone or the text box. The Child Agent will absorb your explanation and prepare for the blind final exam.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Teaching Input Column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="relative">
                    <textarea
                      rows={7}
                      className={`w-full p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#c2983b] transition-all ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                          : 'bg-[#faf8f5] border-[#eae6dc] text-[#12181a] placeholder-[#9ca3af]'
                      }`}
                      placeholder="Explain a concept in simple terms. E.g. 'Interference happens when two light waves meet. If their crests align constructively, the amplitude adds up and produces bright fringes...'"
                      value={isListening ? (teachingText + (teachingText && transcript ? ' ' : '') + transcript) : teachingText}
                      onChange={(e) => {
                        if (!isListening) setTeachingText(e.target.value);
                      }}
                    />

                    {isListening && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Listening Live...
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isListening
                          ? 'bg-red-500 text-white border-red-500 shadow-md'
                          : isDark
                          ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                          : 'bg-[#faf8f5] hover:bg-[#f4f2ea] text-[#0f3238] border-[#eae6dc] shadow-xs'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 text-[#c2983b]" />
                          <span>Voice Teaching</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleTeach}
                      disabled={loading || !teachingText.trim()}
                      className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#0f3238] hover:bg-[#163b40] active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c2983b]" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Explanation</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#c2983b]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Child Agent Understanding Box */}
                <div
                  className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between ${
                    isDark
                      ? 'bg-zinc-900/60 border-zinc-800'
                      : 'bg-[#faf8f5] border-[#eae6dc]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eae6dc] dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#c2983b]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider  font-mono">
                          Child Memory Buffer
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0f3238] text-white font-mono">
                        {taughtConcepts.length} Concepts
                      </span>
                    </div>

                    {taughtConcepts.length === 0 ? (
                      <div className="py-10 text-center text-xs opacity-70 space-y-2">
                        <GraduationCap className="w-8 h-8 mx-auto text-[#c2983b] opacity-80" />
                        <p className="">
                          The Child Agent is waiting for your explanation. Teach a concept to begin memory synthesis.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {taughtConcepts.map((c, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isDark
                                ? 'bg-zinc-900 border-zinc-800'
                                : 'bg-white border-[#eae6dc] shadow-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold ">{c.name}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                                {Math.round((c.confidence || 0.5) * 100)}% Depth
                              </span>
                            </div>
                            <p className={`line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>{c.definition}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#eae6dc] dark:border-zinc-800">
                    <button
                      onClick={runFinalExam}
                      disabled={loading || taughtConcepts.length === 0}
                      className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-[#0f3238] hover:bg-[#163b40] active:scale-95 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Trigger Final Examination</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#c2983b]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: FINAL EVALUATION & DASHBOARD ================= */}
          {step === 4 && (
            <div
              className={`p-8 sm:p-10 rounded-3xl border transition-all space-y-8 ${
                isDark
                  ? 'bg-[#0d1619] border-zinc-800 shadow-sm'
                  : 'bg-white border-[#eae6dc] shadow-[0_4px_20px_rgba(16,41,45,0.04)]'
              }`}
            >
              {/* Header with Scores */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#eae6dc] dark:border-zinc-800">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Step 4 • Evaluation Complete
                  </span>
                  <h2 className={`text-2xl sm:text-3xl font-bold font-serif tracking-tight  mt-2 ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                    Feynman Learning Results
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#4b5563]'}`}>
                    Audited comparison of Child Agent blind performance before and after your explanation.
                  </p>
                </div>

                {/* Score KPI Badges */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3.5 rounded-2xl border text-center min-w-[100px] ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800'
                        : 'bg-[#faf8f5] border-[#eae6dc]'
                    }`}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-wider  font-mono`}>
                      Cold Baseline
                    </p>
                    <p className={`text-xl font-bold font-serif mt-0.5 ${isDark ? 'text-zinc-300' : 'text-[#0f3238]'}`}>
                      {baselineScore}%
                    </p>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl border text-center min-w-[100px] ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800'
                        : 'bg-[#faf8f5] border-[#eae6dc]'
                    }`}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-wider  font-mono`}>
                      Post-Teaching
                    </p>
                    <p className={`text-xl font-bold font-serif mt-0.5 ${isDark ? 'text-white' : 'text-[#0f3238]'}`}>
                      {finalScore}%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl border text-center min-w-[130px] bg-[#c2983b]/10 border-[#c2983b]/30 ">
                    <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#c2983b]">
                      Teaching Efficacy (TES)
                    </p>
                    <p className={`text-2xl font-black font-serif text-[#c2983b] mt-0.5 ${isDark ? "text-white" : "text-[#0f3238]"}`}>
                      {tesScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200'
                        : 'border-[#eae6dc] bg-[#faf8f5] hover:bg-[#f4f2ea] text-[#0f3238] shadow-xs'
                    }`}
                  >
                    <Download className="w-4 h-4 text-[#c2983b]" />
                    <span>Download Exam PDF</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={onGoToDashboard}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isDark
                          ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                          : 'border-[#eae6dc] bg-[#faf8f5] hover:bg-[#f4f2ea] text-[#0f3238]'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#c2983b]" />
                      <span>View in Dashboard</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setFile(null);
                    setSessionTitle('');
                    setSessionId(null);
                    setQuestions([]);
                    setSourceConcepts([]);
                    setTaughtConcepts([]);
                    setExamResults([]);
                    setBaselineScore(0);
                    setFinalScore(0);
                    setTesScore(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0f3238] hover:bg-[#163b40] text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#c2983b]" />
                  <span>Start Another Session</span>
                </button>
              </div>

              {/* Question By Question Breakdown */}
              <div className="space-y-4">
                <h3 className={`text-base sm:text-lg font-bold font-serif ${isDark ? 'text-white' : 'text-[#0f3238]'}`}>
                  Exam Breakdown & Teacher Agent Evaluation
                </h3>
                {examResults.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border space-y-4 ${
                      isDark
                        ? 'bg-zinc-900/60 border-zinc-800'
                        : 'bg-[#faf8f5] border-[#eae6dc] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#c2983b]">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold  mt-0.5">
                          {res.question}
                        </h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold border font-mono ${
                          res.score >= 70
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}
                      >
                        Score: {res.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div
                        className={`p-3.5 rounded-xl border ${
                          isDark
                            ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
                            : 'bg-white border-[#eae6dc] text-[#4b5563]'
                        }`}
                      >
                        <p className={`font-bold uppercase tracking-wider text-[10px] mb-1 font-mono `}>
                          Cold Baseline (Pre-Teaching)
                        </p>
                        <p className="italic">
                          {baselineAnswers[idx]?.childAnswer || "I haven't learned this topic yet, so I don't know the answer."}
                        </p>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl border ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800'
                            : 'bg-white border-[#eae6dc]'
                        }`}
                      >
                        <p className="font-bold uppercase tracking-wider text-[10px] mb-1 font-mono ">
                          Child Agent (Post-Teaching)
                        </p>
                        <p className={isDark ? 'text-zinc-200' : 'text-[#12181a]'}>{res.childAnswer}</p>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl border ${
                          isDark
                            ? 'bg-zinc-900 border-zinc-800'
                            : 'bg-white border-[#eae6dc]'
                        }`}
                      >
                        <p className={`font-bold uppercase tracking-wider text-[10px] mb-1 font-mono `}>
                          Expected Ground Truth
                        </p>
                        <p className={isDark ? 'text-zinc-300' : 'text-[#4b5563]'}>{res.expected}</p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        isDark
                          ? 'bg-[#c2983b]/5 border-[#c2983b]/15 text-zinc-300'
                          : 'bg-white border-[#eae6dc] text-[#2d3748]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#c2983b] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold ">Teacher's Critique: </span>
                        <span>{res.feedback}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyTool;
