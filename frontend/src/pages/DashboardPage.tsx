import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrainCircuit, PlusCircle, BookOpen, Clock, Award,
  TrendingUp, LogOut, FileText,
  Sparkles, Layers, ArrowUpRight, Loader2, Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface DashboardPageProps {
  onStartSession: (sessionData?: any) => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartSession,
  onLogout
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sessions, setSessions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    total_sessions: 0,
    avg_tes: 0,
    avg_baseline: 0,
    avg_final: 0,
    concepts_mastered: 0,
    improvement_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [sessionsRes, analyticsRes] = await Promise.all([
          axios.get('/api/sessions/history'),
          axios.get('/api/sessions/analytics')
        ]);
        if (sessionsRes.data?.sessions) {
          setSessions(sessionsRes.data.sessions);
        }
        if (analyticsRes.data?.analytics) {
          setAnalytics(analyticsRes.data.analytics);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#050507] text-zinc-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark ? 'bg-[#050507]/80 border-zinc-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Study Buddy</span>
              <span className="text-xs px-2 py-0.5 ml-2 rounded-full font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Neural Feynman Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className={`h-6 w-px ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name || 'Student'}</p>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{user?.email}</p>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-red-400'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome Banner */}
        <section className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 border transition-all shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-zinc-900/90 to-[#0c0c12] border-zinc-800 shadow-black/40'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/90 shadow-slate-200/40'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Active Feynman Learning Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}!
              </h1>
              <p className={`text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Upload course material, take a baseline exam, teach the AI in your own words, and calculate your genuine
                <strong> Teaching Efficacy Score (TES)</strong>.
              </p>
            </div>

            <div>
              <button
                onClick={() => onStartSession()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>New Learning Session</span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0c10] border-zinc-800/80 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Average TES
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{analytics.avg_tes}%</span>
              <span className="text-xs font-medium text-emerald-500">Teaching Efficacy</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0c10] border-zinc-800/80 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Total Sessions
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{analytics.total_sessions}</span>
              <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Curated Modules</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0c10] border-zinc-800/80 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Delta Improvement
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-500">+{analytics.improvement_rate}%</span>
              <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Over Baseline</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0c10] border-zinc-800/80 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Neural Concepts
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">{analytics.concepts_mastered}</span>
              <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Taught to Model</span>
            </div>
          </div>
        </section>

        {/* Learning Sessions Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Learning Sessions</h2>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Review your past AI teaching sessions, baseline differentials, and exam reports.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className={`p-12 rounded-3xl border text-center flex flex-col items-center justify-center ${
              isDark ? 'bg-[#0c0c10] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-1">No learning sessions yet</h3>
              <p className={`text-sm max-w-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Upload your first lecture slides or textbook PDF to start teaching your personal Child Agent.
              </p>
              <button
                onClick={() => onStartSession()}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                Start First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] flex flex-col justify-between ${
                    isDark
                      ? 'bg-[#0c0c10] border-zinc-800/80 hover:border-zinc-700 shadow-lg'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {s.subject || 'General'}
                      </span>
                      <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {s.created_at ? s.created_at.split(' ')[0] : 'Recent'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight mb-1 line-clamp-1">{s.title}</h3>
                    {s.material_name && (
                      <p className={`text-xs flex items-center gap-1.5 mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[220px]">{s.material_name}</span>
                      </p>
                    )}

                    {/* Score comparison pill */}
                    <div className={`p-3.5 rounded-2xl mb-6 border ${
                      isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200/70'
                    }`}>
                      <div className="grid grid-cols-3 text-center divide-x divide-zinc-700/30">
                        <div>
                          <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Baseline</p>
                          <p className="text-base font-bold mt-0.5">{s.baseline_score}%</p>
                        </div>
                        <div>
                          <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Final</p>
                          <p className="text-base font-bold mt-0.5 text-blue-500">{s.final_score}%</p>
                        </div>
                        <div>
                          <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>TES</p>
                          <p className="text-base font-bold mt-0.5 text-emerald-500">{s.tes_score}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartSession(s)}
                    className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isDark
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Launch Learning Workspace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
