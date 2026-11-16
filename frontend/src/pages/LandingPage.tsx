import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Brain, LockKeyhole, Cpu, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onStart: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onGoToDashboard: () => void;
}

const Hero3D = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(1.6, 2);
    const material = new THREE.MeshStandardMaterial({
      color: isDark ? 0x93c5fd : 0x2563eb,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.5 : 2.0);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      mesh.rotation.x = elapsedTime * 0.15;
      mesh.rotation.y = elapsedTime * 0.25;
      mesh.position.y = Math.sin(elapsedTime * 0.8) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />;
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onOpenAuth,
  onGoToDashboard
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });
      
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root>
      <div
        ref={containerRef}
        className={`min-h-screen font-sans overflow-hidden transition-colors duration-300 ${
          isDark ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full z-50 px-6 sm:px-10 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors ${
            isDark
              ? 'bg-[#0a0a0c]/80 border-white/5'
              : 'bg-white/80 border-slate-200 shadow-sm shadow-slate-100'
          }`}
        >
          <div className="text-xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Brain className="w-4 h-4" />
            </div>
            <span>Study Buddy</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={onGoToDashboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard ({user?.name?.split(' ')[0]})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isDark
                      ? 'hover:bg-white/10 text-zinc-300 hover:text-white'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 px-6">
          <Hero3D isDark={isDark} />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block hero-text">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-zinc-300'
                    : 'border-slate-200 bg-white text-slate-700 shadow-sm'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>The Automated Feynman Technique</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.08] hero-text">
              You teach the AI.<br />
              <span className={isDark ? 'text-zinc-500' : 'text-blue-600'}>It takes the exam.</span>
            </h1>

            <p className={`text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto hero-text font-normal leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              Master complex topics by teaching a deliberately blank Child Agent. 
              The system tests its knowledge before and after, verifying your genuine understanding.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 hero-text">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Learning Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => onOpenAuth('login')}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-base border transition-all cursor-pointer ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Track TES</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Boundary Diagram Section */}
        <section className={`py-32 relative border-t transition-colors ${
          isDark
            ? 'border-white/5 bg-gradient-to-b from-[#0a0a0c] to-[#0f0f14]'
            : 'border-slate-200 bg-gradient-to-b from-slate-50 to-white'
        }`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20 reveal-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                The Dual-Agent Information Boundary
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Strict mathematical isolation guarantees the Child Agent learns only from your explanations.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 reveal-up">
              {/* Teacher Model */}
              <div className={`w-full md:w-1/3 p-8 rounded-3xl border transition-all relative overflow-hidden ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Teacher Agent</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Has full access to the uploaded textbook or lecture slides. Generates the closed-book exam and objectively evaluates answers.
                </p>
              </div>

              {/* The Wall */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-inner">
                  <LockKeyhole className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-amber-500 mt-3 tracking-widest uppercase text-center">
                  Zero Data Leakage
                </div>
              </div>

              {/* Student Model */}
              <div className={`w-full md:w-1/3 p-8 rounded-3xl border transition-all relative overflow-hidden ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Child Agent</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Starts completely blank. Takes a baseline exam (scoring ~0%), then builds neural memory solely from your teaching.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Step Workflow */}
        <section className="py-28 relative">
          <div className="max-w-4xl mx-auto px-6">
            {[
              { num: '01', title: 'Upload & Baseline Test', desc: 'The Teacher Agent ingests the material and creates 10 questions. The Child Agent takes a baseline test cold to confirm zero pre-existing knowledge.' },
              { num: '02', title: 'Teach via Voice or Text', desc: 'Explain the concepts in simple language. The system extracts definitions and constructs the Child Agent’s neural memory.' },
              { num: '03', title: 'Final Exam & TES Scoring', desc: 'The Child Agent retakes the exam using your teachings. Your Teaching Efficacy Score (TES) measures true comprehension.' }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-8 mb-16 last:mb-0 reveal-up items-start">
                <div className={`text-5xl sm:text-6xl font-black leading-none ${isDark ? 'text-zinc-800' : 'text-slate-200'}`}>
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className={`text-base font-normal leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className={`py-32 relative text-center border-t transition-colors ${
          isDark ? 'border-white/5 bg-[#08080a]' : 'border-slate-200 bg-white'
        }`}>
          <div className="relative z-10 reveal-up px-6 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
              Ready to test your mastery?
            </h2>
            <p className={isDark ? 'text-zinc-400' : 'text-slate-600'}>
              Start a new learning session now or sign in to track your personal analytics.
            </p>
            <div>
              <button 
                onClick={onStart}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Launch Learning Tool
              </button>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default LandingPage;
