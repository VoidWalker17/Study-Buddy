import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, BookOpen, BrainCircuit, CheckCircle2, AlertCircle, RefreshCw, FileText, Bot, ArrowRight, Mic, MicOff, Cpu, Sparkles, ChevronLeft, Download, Eye, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function StudyTool({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{concepts: any[], questions: any[]} | null>(null);
  const [error, setError] = useState<string>('');
  
  const [teachingText, setTeachingText] = useState("");
  const [taughtConcepts, setTaughtConcepts] = useState<any[]>([]);
  
  const [examResults, setExamResults] = useState<any[]>([]);
  const [takingExam, setTakingExam] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  // Speech Recognition State
  const { transcript, listening: isListening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = "test-user-123";

  // Refs for animations
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
    const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
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
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/ml/process-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeach = async () => {
    if (!teachingText.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/ml/extract-concepts', {
        explanation: teachingText,
        user_id: userId,
        source_concepts: result?.concepts || []
      });
      if (response.data.extracted_concepts && response.data.extracted_concepts.length > 0) {
        setTaughtConcepts(prev => [...prev, ...response.data.extracted_concepts]);
        setTeachingText("");
      } else {
        setError("AI couldn't extract any concepts. The local Ollama model might have failed to generate valid JSON or the explanation was too vague.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to teach concept. The local backend or Ollama server might be unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result?.questions) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(10, 10, 12);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Study Buddy', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 160);
    doc.text('Neural Evaluation Exam Paper', 20, 28);
    
    doc.setTextColor(0, 0, 0);
    let yPos = 50;

    // Questions Section
    doc.setFontSize(16);
    doc.text('Exam Questions', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    result.questions.forEach((q: any, i: number) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${i + 1}. [${q.difficulty?.toUpperCase() || 'MEDIUM'}]`, 20, yPos);
      
      doc.setFont('helvetica', 'normal');
      const splitQ = doc.splitTextToSize(q.question, 170);
      doc.text(splitQ, 20, yPos + 6);
      
      // Draw answer lines
      yPos += (splitQ.length * 5) + 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);
      doc.line(20, yPos + 10, 190, yPos + 10);
      doc.line(20, yPos + 20, 190, yPos + 20);
      
      yPos += 35;
    });

    // Answer Key Section
    doc.addPage();
    yPos = 20;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Teacher Answer Key', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    result.questions.forEach((q: any, i: number) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`A${i + 1}.`, 20, yPos);
      
      doc.setFont('helvetica', 'normal');
      const splitA = doc.splitTextToSize(q.expectedAnswer, 160);
      doc.text(splitA, 30, yPos);
      
      yPos += (splitA.length * 5) + 5;
    });

    doc.save('study_buddy_exam.pdf');
  };

  const runExam = async () => {
    if (!result?.questions || result.questions.length === 0) {
      setError("No questions generated for this document. Cannot start exam.");
      return;
    }
    setTakingExam(true);
    setLoading(true);
    const results = [];
    
    try {
      for (const q of result.questions) {
        const memoryRes = await axios.post('/api/ml/retrieve-memory', {
          question: q.question,
          user_id: userId
        });
        const childAnswer = memoryRes.data.answer;

        const gradeRes = await axios.post('/api/ml/grade-answer', {
          question: q.question,
          student_answer: childAnswer,
          expected_answer: q.expectedAnswer
        });

        results.push({
          question: q.question,
          childAnswer: childAnswer,
          expected: q.expectedAnswer,
          score: gradeRes.data.score,
          feedback: gradeRes.data.feedback
        });
      }
      setExamResults(results);
    } catch (err: any) {
      console.error(err);
      setError("Failed during exam execution. The AI server might be unreachable.");
    } finally {
      setLoading(false);
      setTakingExam(false);
    }
  };

  // Determine current active step
  const currentStep = !result ? 1 : (examResults.length === 0 && !takingExam ? 2 : 3);

  // Animations when changing steps
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 font-sans pb-24 selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600 via-[#050507] to-transparent mix-blend-screen"></div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" onClick={(e) => { e.preventDefault(); onBack(); window.location.href = '/'; }} className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </a>
            <div className="flex items-center gap-4 cursor-default group">
              <div className="w-10 h-10 bg-gradient-to-tr from-zinc-800 to-zinc-600 rounded-xl flex items-center justify-center p-[1px] shadow-lg">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[11px] flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-zinc-300" />
                </div>
              </div>
              <span className="font-semibold tracking-tight text-xl text-zinc-200">Study Buddy AI</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-inner">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">System Online</span>
          </div>
        </div>
      </header>

      <main className="w-full px-12 pt-32 flex flex-col lg:flex-row gap-12 items-start relative z-10">
        
        {/* Left Sidebar - Navigation / Progress */}
        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-32 space-y-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Training Protocol</h1>
            <p className="text-sm text-zinc-500">Complete the sequence to evaluate the neural agent's comprehension.</p>
          </div>

          {[
            { step: 1, title: 'Upload Source', icon: UploadCloud, desc: 'Provide foundational material' },
            { step: 2, title: 'Knowledge Transfer', icon: Cpu, desc: 'Teach the Child Agent' },
            { step: 3, title: 'Neural Evaluation', icon: Sparkles, desc: 'Administer final exam' }
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            
            return (
              <div 
                key={item.step}
                className={`relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-blue-500/10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                    : isCompleted 
                      ? 'opacity-60' 
                      : 'opacity-40 grayscale'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                  isCompleted ? 'bg-white/10 text-white border-white/10' : 'bg-white/5 text-zinc-500 border-white/5'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={`font-semibold ${isActive ? 'text-blue-100' : 'text-zinc-300'}`}>{item.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                </div>
                {isActive && (
                  <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 w-full" ref={contentRef}>
          <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
            
            <div className="p-10 lg:p-14 relative z-10">
              {/* Step 1 Content */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight mb-4 text-white">Initialize Parse Sequence</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                      Upload the source document. The Teacher Agent will process this material to map out core concepts and construct the hidden evaluation questions.
                    </p>
                  </div>

                  <div className="bg-[#0a0a0c]/80 border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center group transition-all duration-300 hover:bg-[#0f0f13]">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all duration-500 border border-white/10 group-hover:border-blue-500/30 shadow-2xl">
                      <FileText className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-zinc-200">Select a PDF Document</h3>
                    <p className="text-zinc-500 mb-8 max-w-md">Textbooks, presentation decks, or academic papers (PDF format).</p>
                    
                    <input 
                      type="file" 
                      accept=".pdf" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={triggerFileInput}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all active:scale-95"
                      >
                        {file ? file.name : "Browse Files"}
                      </button>
                      <button 
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      >
                        {loading ? (
                          <><RefreshCw className="w-5 h-5 animate-spin text-black" /> Processing...</>
                        ) : (
                          "Upload & Parse"
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 text-red-400 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 Content */}
              {currentStep === 2 && result && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight mb-4 text-white">Knowledge Transfer</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                      The Child Agent is currently a blank slate. Explain the concepts clearly below to populate its neural memory before the final evaluation.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                      <div className="relative">
                        <textarea
                          className="w-full h-64 p-6 bg-[#0a0a0c] border border-white/10 rounded-3xl resize-none text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base placeholder-zinc-600 shadow-inner"
                          placeholder="Explain a concept in your own words. For example: 'An operating system is the software that manages computer hardware and software resources...'"
                          value={isListening ? (teachingText + (teachingText && transcript ? ' ' : '') + transcript) : teachingText}
                          onChange={(e) => {
                            if (!isListening) setTeachingText(e.target.value);
                          }}
                        />
                        {isListening && (
                          <div className="absolute top-4 right-4 flex items-center gap-2 text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Listening...
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <button
                          onClick={toggleListening}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all active:scale-95 border ${
                            isListening 
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                              : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {isListening ? (
                            <><MicOff className="w-4 h-4" /> Stop Recording</>
                          ) : (
                            <><Mic className="w-4 h-4" /> Voice Input</>
                          )}
                        </button>
                        <button 
                          onClick={handleTeach}
                          disabled={loading || !teachingText.trim()}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                          {loading ? (
                            <><RefreshCw className="w-5 h-5 animate-spin" /> Processing...</>
                          ) : (
                            "Submit Knowledge"
                          )}
                        </button>
                      </div>
                      {error && (
                        <div className="flex items-start gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:col-span-2 bg-[#0a0a0c] border border-white/5 rounded-3xl p-6 flex flex-col h-[400px]">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <BrainCircuit className="w-4 h-4 text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-zinc-200">Neural Memory</h3>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
                          {taughtConcepts.length} Concepts
                        </span>
                      </div>
                      
                      {taughtConcepts.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                          <Bot className="w-10 h-10 mb-4 text-zinc-600" />
                          <p className="text-sm text-zinc-500 max-w-[200px]">Memory is empty. Waiting for knowledge input...</p>
                        </div>
                      ) : (
                        <ul className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          {taughtConcepts.map((c, idx) => (
                            <li key={idx} className="bg-white/5 p-4 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-blue-100">{c.name}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                                  {Math.round(c.confidence * 100)}% Conf
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{c.definition}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowQuestions(!showQuestions)}
                        className="px-5 py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {showQuestions ? "Hide Questions" : "View Questions"}
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="px-5 py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>

                    <button 
                      onClick={runExam}
                      disabled={loading || takingExam || taughtConcepts.length === 0}
                      className="px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      {takingExam ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> Administering Exam...</>
                      ) : (
                        <>Start Final Exam <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>

                  {showQuestions && result?.questions && (
                    <div className="mt-8 bg-[#0a0a0c] border border-white/5 rounded-3xl p-6 shadow-lg">
                      <h3 className="text-xl font-semibold text-white mb-4">Teacher's Generated Questions</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {result.questions.map((q: any, i: number) => (
                          <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 transition-colors hover:bg-white/10">
                            <p className="font-medium text-zinc-200 mb-2">{i + 1}. {q.question}</p>
                            <p className="text-sm text-emerald-400 mb-2">Expected Answer: {q.expectedAnswer}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {q.difficulty && <span className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-md text-zinc-400">Difficulty: {q.difficulty}</span>}
                              {q.concepts && q.concepts.length > 0 && <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-md">Concepts: {q.concepts.join(', ')}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 Content */}
              {currentStep === 3 && result && (
                <div className="space-y-8">
                  {takingExam && examResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                        <div className="w-24 h-24 bg-[#0a0a0c] border border-white/10 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                          <Bot className="w-10 h-10 text-blue-400 animate-bounce" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center z-20">
                          <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-3">Child Agent is Taking the Exam</h2>
                      <p className="text-zinc-400 max-w-md mx-auto">
                        The neural model is processing the test questions based on the knowledge you transferred. This evaluation may take up to 2 minutes...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                        <div>
                          <h2 className="text-3xl font-semibold tracking-tight mb-2 text-white">Evaluation Results</h2>
                          <p className="text-zinc-400">Review the Child Agent's performance against the source material.</p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-[#0a0a0c] p-4 rounded-2xl border border-white/10 shadow-inner">
                          <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Overall Score</div>
                          <div className="text-3xl font-bold text-white">
                            {examResults.length > 0 ? Math.round(examResults.reduce((acc, curr) => acc + curr.score, 0) / examResults.length) : 0}<span className="text-lg text-zinc-500">/100</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                    {examResults.map((res, idx) => (
                      <div key={idx} className="bg-[#0a0a0c] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
                        <div className="p-6 md:p-8">
                          <div className="flex items-start gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-400 font-bold">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Hidden Question</div>
                              <h4 className="text-xl font-medium text-zinc-100">{res.question}</h4>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative">
                              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#0a0a0c] px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                <Bot className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Child's Answer</span>
                              </div>
                              <p className="text-sm text-zinc-300 leading-relaxed pt-2">{res.childAnswer}</p>
                            </div>
                            
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative">
                              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#0a0a0c] px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Expected (Source)</span>
                              </div>
                              <p className="text-sm text-zinc-400 leading-relaxed pt-2 opacity-80">{res.expected}</p>
                            </div>
                          </div>

                          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center ${res.score >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl border ${res.score >= 70 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                              {res.score}
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Teacher's Grade & Feedback</div>
                              <p className="text-base text-zinc-200">"{res.feedback}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 flex justify-center">
                    <button 
                      onClick={() => {
                        setResult(null);
                        setTaughtConcepts([]);
                        setExamResults([]);
                        setTakingExam(false);
                        setFile(null);
                      }}
                      className="px-6 py-3 bg-white/5 text-zinc-300 hover:text-white rounded-xl font-medium border border-white/10 hover:bg-white/10 transition-all"
                    >
                      Start New Session
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
        </div>

      </main>
    </div>
  );
}

export default StudyTool;
