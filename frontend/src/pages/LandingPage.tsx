import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Mic, Brain, Lock, LockKeyhole, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onStart: () => void;
}

const Hero3D = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#444" />
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Icosahedron args={[1.5, 4]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ffffff"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </Icosahedron>
      </Float>
    </Canvas>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
      });
      
      // Reveal Animations
      gsap.utils.toArray('.reveal-up').forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          y: 50,
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
      <div ref={containerRef} className="bg-[#0a0a0a] min-h-screen text-white font-sans overflow-hidden">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md bg-[#0a0a0a]/50 border-b border-white/5">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Brain className="w-6 h-6 text-zinc-300" />
            Study Buddy AI
          </div>
          <button 
            onClick={onStart}
            className="px-5 py-2 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <Hero3D />
          {/* Subtle background gradient to ensure it's not totally black behind the hero */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hero-text">
              <span className="text-sm font-medium text-zinc-300">The Feynman Technique, Automated</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] hero-text">
              You teach the AI.<br />
              <span className="text-zinc-400">It takes the exam.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto hero-text font-light">
              Master any material by explaining it to a completely blank AI model. 
              If the AI can pass the exam based only on what you taught it, you truly understand it.
            </p>
            <button 
              onClick={onStart}
              className="hero-text group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold text-lg rounded-full overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Teaching <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </section>

        {/* Boundary Diagram Section */}
        <section className="py-32 relative border-t border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20 reveal-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Information Boundary</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Strict separation ensures the student model learns <span className="text-white font-medium">only</span> from you.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 reveal-up">
              {/* Teacher Model */}
              <div className="w-full md:w-1/3 p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <BookOpen className="w-12 h-12 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Teacher Model</h3>
                <p className="text-zinc-400">Has full access to the source material. Grades the exam.</p>
              </div>

              {/* The Wall */}
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-px bg-gradient-to-b from-transparent to-zinc-500/50 md:hidden" />
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                  <LockKeyhole className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-zinc-400 mt-4 tracking-widest uppercase">No Source Access</div>
                <div className="h-16 w-px bg-gradient-to-b from-zinc-500/50 to-transparent md:hidden" />
              </div>

              {/* Student Model */}
              <div className="w-full md:w-1/3 p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="w-12 h-12 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Student Model</h3>
                <p className="text-zinc-400">Starts blank. Only learns from your voice teaching sessions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-32 relative">
          <div className="max-w-4xl mx-auto px-6">
            {[
              { num: '01', title: 'Upload Material', desc: 'Provide a PDF or text. The Teacher model generates a secret exam based on this content.' },
              { num: '02', title: 'Teach the AI', desc: 'Use your voice to explain the concepts. The Student model listens, asks questions, and builds its knowledge.' },
              { num: '03', title: 'The Evaluation', desc: 'The Student model takes the exam. The Teacher model grades it, revealing your knowledge gaps.' }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-8 mb-20 last:mb-0 reveal-up">
                <div className="text-6xl font-black text-white/10 leading-none">{step.num}</div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-xl text-zinc-400 font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-32 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-16 text-center tracking-tight reveal-up">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-up">
              <div className="p-10 rounded-[2rem] bg-zinc-900/50 border border-white/5 row-span-2">
                <Mic className="w-10 h-10 text-zinc-300 mb-6" />
                <h3 className="text-3xl font-bold mb-4">Voice-First Teaching</h3>
                <p className="text-zinc-400 text-lg">Speak naturally. Real-time transcription captures your explanation exactly as you deliver it, making the process frictionless.</p>
              </div>
              <div className="p-10 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                <Lock className="w-10 h-10 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Closed-Book Protocol</h3>
                <p className="text-zinc-400">The student AI is completely isolated from the source document.</p>
              </div>
              <div className="p-10 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                <Brain className="w-10 h-10 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Interactive Pushback</h3>
                <p className="text-zinc-400">The student asks clarifying questions if your explanation is vague.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-40 relative flex items-center justify-center overflow-hidden text-center border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent pointer-events-none" />
          <div className="relative z-10 reveal-up px-6">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to master it?</h2>
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-white text-black font-bold text-xl rounded-full hover:scale-105 transition-transform"
            >
              Start Your First Session
            </button>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};
export default LandingPage;

