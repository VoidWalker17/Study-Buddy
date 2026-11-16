import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  UploadCloud, BrainCircuit, CheckCircle2, AlertCircle,
  RefreshCw, Bot, ArrowRight, Mic, MicOff, Sparkles,
  ChevronLeft, Download, Loader2, LayoutDashboard,
  Check
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
  const [sourceConcepts, setSourceConcepts] = useState<any[]>([]);
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
    setLoadingMessage('Creating session and extracting ground truth concepts...');
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
      if (currentSessionId) {
        formData.append('session_id', currentSessionId);
      }

      const res = await axios.post('/api/ml/process-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const extractedConcepts = res.data?.concepts || [];
      const generatedQuestions = res.data?.questions || [];

      setSourceConcepts(extractedConcepts);
      setQuestions(generatedQuestions);

      // 3. Automatically advance to Baseline Exam
      setStep(2);
      await runBaselineExamination(currentSessionId, generatedQuestions);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 2: Run Baseline Exam (Cold Test)
  const runBaselineExamination = async (activeSessionId: string | null, testQuestions: any[]) => {
    setLoading(true);
    setLoadingMessage('Teacher Agent is testing Child Agent cold (before any teaching)...');
    try {
      const baselineRes = await axios.post('/api/ml/run-baseline-exam', {
        session_id: activeSessionId || 'guest_session',
        user_id: userId,
        questions: testQuestions
      });

      const bScore = baselineRes.data?.baseline_score ?? 5.0;
      setBaselineScore(bScore);
      setBaselineAnswers(baselineRes.data?.results || []);
    } catch (err: any) {
      console.warn('Baseline exam warning:', err);
      setBaselineScore(5.0);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 3: Teach Child Agent
  const handleTeach = async () => {
    if (!teachingText.trim()) return;
    setLoading(true);
    setLoadingMessage('Extracting knowledge into Child Agent neural memory...');
    setError('');

    try {
      const response = await axios.post('/api/ml/extract-concepts', {
        explanation: teachingText,
        user_id: userId,
        session_id: sessionId,
        source_concepts: sourceConcepts
      });

      if (response.data.extracted_concepts && response.data.extracted_concepts.length > 0) {
        setTaughtConcepts(prev => [...prev, ...response.data.extracted_concepts]);
        setTeachingText('');
      } else {
        setError("AI couldn't extract distinct concepts from your explanation. Try elaborating with more specific definitions or examples.");
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract knowledge. Ensure backend and Ollama model are running.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Step 4: Final Exam Execution & Evaluation
  const runFinalExam = async () => {
    if (questions.length === 0) {
      setError('No exam questions available.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Child Agent is taking the final exam using your taught memory...');
    setStep(4);
    const results = [];
    let totalScore = 0;

    try {
      for (const q of questions) {
        // Child Agent answers from memory only
        const memoryRes = await axios.post('/api/ml/retrieve-memory', {
          question: q.question,
          user_id: userId,
          session_id: sessionId
        });
        const childAnswer = memoryRes.data?.answer || "I don't know.";

        // Teacher Agent grades answer against expected
        const gradeRes = await axios.post('/api/ml/grade-answer', {
          question: q.question,
          student_answer: childAnswer,
          expected_answer: q.expectedAnswer,
          session_id: sessionId,
          question_id: q.id,
          exam_type: 'final'
        });

        const score = Number(gradeRes.data?.score || 0);
        totalScore += score;

        results.push({
          question: q.question,
          childAnswer: childAnswer,
          expected: q.expectedAnswer,
          score: score,
          feedback: gradeRes.data?.feedback || 'Evaluated.'
        });
      }

      setExamResults(results);

      // Calculate Scores
      const avgFinal = Math.round(totalScore / max(1, results.length));
      setFinalScore(avgFinal);

      // TES Formula: (Final - Baseline) * Coverage Ratio
      const delta = Math.max(0, avgFinal - baselineScore);
      const coverageRatio = sourceConcepts.length > 0
        ? Math.min(1.0, taughtConcepts.length / sourceConcepts.length)
        : 1.0;
      const calculatedTes = Math.round(delta * (0.5 + 0.5 * coverageRatio));
      setTesScore(calculatedTes);

      // Save to SQLite
      if (sessionId && isAuthenticated) {
        await axios.post('/api/sessions/complete', {
          session_id: sessionId,
          baseline_score: baselineScore,
          final_score: avgFinal,
          tes_score: calculatedTes
        });
      }

    } catch (err: any) {
      console.error(err);
      setError('An error occurred during final exam grading.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Helper for max
  function max(a: number, b: number) {
    return a > b ? a : b;
  }

  // Generate & Download Exam PDF
  const handleDownloadPDF = () => {
    if (!questions || questions.length === 0) return;
    const doc = new jsPDF();

    // Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Study Buddy - Exam Paper', 20, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Subject: ${sessionSubject} | Topic: ${sessionTitle || 'Course Assessment'}`, 20, 28);
    doc.text(`Student: ${user?.name || 'Self-Study Candidate'} | Generated: ${new Date().toLocaleDateString()}`, 20, 35);

    doc.setTextColor(15, 23, 42);
    let yPos = 55;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Examination Questions', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    questions.forEach((q: any, i: number) => {
      if (yPos > 240) {
        doc.addPage();
        yPos = 25;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`Q${i + 1}. [${(q.difficulty || 'MEDIUM').toUpperCase()}]`, 20, yPos);

      doc.setFont('helvetica', 'normal');
      const splitQ = doc.splitTextToSize(q.question, 170);
      doc.text(splitQ, 20, yPos + 6);

      yPos += (splitQ.length * 5) + 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPos, 190, yPos);
      doc.line(20, yPos + 8, 190, yPos + 8);
      doc.line(20, yPos + 16, 190, yPos + 16);

      yPos += 28;
    });

    // Answer Key Page
    doc.addPage();
    yPos = 25;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Teacher Answer Key & Explanations', 20, yPos);
    yPos += 12;

    doc.setFontSize(10);
    questions.forEach((q: any, i: number) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 25;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`A${i + 1}.`, 20, yPos);

      doc.setFont('helvetica', 'normal');
      const splitA = doc.splitTextToSize(q.expectedAnswer, 160);
      doc.text(splitA, 30, yPos);

      yPos += (splitA.length * 5) + 8;
    });

    doc.save(`${(sessionTitle || 'study_buddy_exam').toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  // Step transition animation
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [step]);

  return (
    <div className={`min-h-screen font-sans pb-24 transition-colors duration-300 relative ${
      isDark ? 'bg-[#050507] text-zinc-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? 'bg-[#050507]/80 border-zinc-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight">Study Buddy</span>
                {sessionTitle && (
                  <span className={`hidden sm:inline-block text-xs ml-2 px-2 py-0.5 rounded-md font-medium border truncate max-w-[200px] ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
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
                className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                    : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Sign In to Save
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        {/* Step Progress Indicator Bar */}
        <div className={`p-4 rounded-2xl border mb-10 transition-all ${
          isDark ? 'bg-[#0a0a0e] border-zinc-800/80 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: 'Upload & Setup' },
              { num: 2, label: 'Baseline Exam' },
              { num: 3, label: 'Teach Child Agent' },
              { num: 4, label: 'Final Evaluation' }
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  step === s.num
                    ? isDark
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : step > s.num
                    ? isDark
                      ? 'text-emerald-400 font-medium'
                      : 'text-emerald-600 font-medium'
                    : isDark
                    ? 'text-zinc-600'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  {step > s.num ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current">
                      {s.num}
                    </span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Loading Spinner Banner */}
        {loading && (
          <div className="mb-8 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center gap-4 animate-pulse">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-600">Model Processing Active</p>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {loadingMessage || 'Processing neural evaluation...'}
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Execution Alert</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={contentRef}>
          {/* ================= STEP 1: UPLOAD & SETUP ================= */}
          {step === 1 && (
            <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'bg-[#0a0a0e] border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Step 1 • Course Material Setup
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-3">
                  Upload Study Material
                </h2>
                <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  The Teacher Agent will analyze this document, extract foundational concepts, and prepare a 10-question closed-book exam.
                </p>
              </div>

              {/* Session Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Session Title / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wave Optics & Interference"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Subject / Domain
                  </label>
                  <select
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                  file
                    ? isDark
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-emerald-500/40 bg-emerald-50/50'
                    : isDark
                    ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-blue-600/10 text-blue-600">
                  <UploadCloud className="w-7 h-7" />
                </div>

                {file ? (
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to Process
                    </div>
                    <p className="font-bold text-base">{file.name}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to choose a different PDF
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-base mb-1">Click to select PDF or drag and drop</p>
                    <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      Lecture slides, lecture notes, textbook chapters (Max 25MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUploadAndProcess}
                  disabled={loading || !file}
                  className="px-8 py-3.5 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ingesting Material...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Exam & Run Baseline</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: BASELINE EXAMINATION ================= */}
          {step === 2 && (
            <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'bg-[#0a0a0e] border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/40">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    Step 2 • Feynman Cold Baseline
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                    Baseline Exam Established
                  </h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    The Child Agent took the test with zero taught memory to measure knowledge leakage.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border text-center min-w-[140px] ${
                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Baseline Score
                  </p>
                  <p className="text-3xl font-black text-purple-500 mt-0.5">{baselineScore}%</p>
                </div>
              </div>

              {/* Baseline Summary Explanation */}
              <div className={`p-5 rounded-2xl border flex items-start gap-3 ${
                isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <Bot className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-semibold text-sm">Why did the Child Agent score {baselineScore}%?</p>
                  <p className={isDark ? 'text-zinc-400' : 'text-slate-600'}>
                    According to the Feynman Protocol, the Child Agent has zero access to the uploaded document. It answered honestly with no information. Your goal in Step 3 is to teach it and raise this score!
                  </p>
                </div>
              </div>

              {/* Questions Preview Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base">Teacher Agent Generated {questions.length} Practice Questions</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownloadPDF}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => setShowQuestions(!showQuestions)}
                      className="text-xs font-semibold text-blue-500 hover:underline"
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
                          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-500">Q{idx + 1}. [{q.difficulty?.toUpperCase() || 'MEDIUM'}]</span>
                          {q.concepts && <span className="text-[10px] text-zinc-500">{q.concepts.join(', ')}</span>}
                        </div>
                        <p className="font-medium text-sm">{q.question}</p>
                        <p className={`italic ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Expected: {q.expectedAnswer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Teach Child Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: TEACH CHILD AGENT ================= */}
          {step === 3 && (
            <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'bg-[#0a0a0e] border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Step 3 • Active Feynman Teaching
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  Teach the Child Agent
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Explain the concepts simply using your microphone or the text box. The AI extracts structured neural memories from your words.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Teaching Input Column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="relative">
                    <textarea
                      rows={6}
                      className={`w-full p-4 rounded-2xl border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder="Explain a concept in simple terms. E.g. 'Interference happens when two light waves meet. If their crests align constructively, brightness increases...'"
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
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>Voice Teaching</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleTeach}
                      disabled={loading || !teachingText.trim()}
                      className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Knowledge</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Neural Memory Box */}
                <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/40">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-blue-500" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Neural Memory</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500">
                        {taughtConcepts.length} Concepts
                      </span>
                    </div>

                    {taughtConcepts.length === 0 ? (
                      <div className="py-12 text-center text-xs opacity-60">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Memory is empty. Teach a concept to begin memory formation.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {taughtConcepts.map((c, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs space-y-1 ${
                              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-blue-500">{c.name}</span>
                              <span className="text-[10px] text-emerald-500 font-semibold">
                                {Math.round((c.confidence || 0.5) * 100)}% Depth
                              </span>
                            </div>
                            <p className={`line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{c.definition}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-zinc-800/30">
                    <button
                      onClick={runFinalExam}
                      disabled={loading || taughtConcepts.length === 0}
                      className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Trigger Final Examination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: FINAL EVALUATION & DASHBOARD ================= */}
          {step === 4 && (
            <div className={`p-8 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'bg-[#0a0a0e] border-zinc-800' : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}>
              {/* Header with Scores */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800/40">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Step 4 • Evaluation Complete
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                    Feynman Learning Results
                  </h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Here is how the Child Agent performed after your teaching vs its cold baseline.
                  </p>
                </div>

                {/* Score KPI Badges */}
                <div className="flex items-center gap-3">
                  <div className={`p-3.5 rounded-2xl border text-center min-w-[100px] ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Baseline</p>
                    <p className="text-xl font-bold mt-0.5">{baselineScore}%</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-center min-w-[100px] ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Post-Teaching</p>
                    <p className="text-xl font-bold text-blue-500 mt-0.5">{finalScore}%</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border text-center min-w-[120px] bg-emerald-500/10 border-emerald-500/20 text-emerald-600">
                    <p className="text-[10px] font-bold uppercase tracking-wider">Teaching Efficacy</p>
                    <p className="text-2xl font-black mt-0.5">{tesScore}%</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isDark ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Exam PDF</span>
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={onGoToDashboard}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isDark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start Another Session</span>
                </button>
              </div>

              {/* Question By Question Breakdown */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Exam Breakdown & Teacher Feedback</h3>
                {examResults.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                          Question {idx + 1}
                        </span>
                        <h4 className="text-base font-semibold mt-0.5">{res.question}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        res.score >= 70
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        Score: {res.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className={`p-3.5 rounded-xl border ${
                        isDark ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400' : 'bg-slate-100/60 border-slate-200 text-slate-500'
                      }`}>
                        <p className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          Cold Baseline (Pre-Teaching)
                        </p>
                        <p className="italic">
                          {baselineAnswers[idx]?.childAnswer || "I haven't learned this topic yet, so I don't know the answer."}
                        </p>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${
                        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className="font-bold uppercase tracking-wider text-[10px] mb-1 text-blue-500">
                          Child Agent (Post-Teaching)
                        </p>
                        <p className={isDark ? 'text-zinc-200' : 'text-slate-800'}>{res.childAnswer}</p>
                      </div>

                      <div className={`p-3.5 rounded-xl border ${
                        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className={`font-bold uppercase tracking-wider text-[10px] mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          Expected Ground Truth
                        </p>
                        <p className={isDark ? 'text-zinc-300' : 'text-slate-700'}>{res.expected}</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isDark ? 'bg-blue-500/5 border-blue-500/10 text-zinc-300' : 'bg-blue-50 border-blue-100 text-slate-700'
                    }`}>
                      <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-500">Teacher's Critique: </span>
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
