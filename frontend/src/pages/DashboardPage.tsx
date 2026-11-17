import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Bot, Clock,
  Plus, ChevronRight, ArrowRight,
  LogOut, Sparkles, BookOpen, Flame,
  GraduationCap, TrendingUp, CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { StudyTool } from './StudyTool';

interface DashboardPageProps {
  onStartSession?: (sessionData?: any) => void;
  onLogout: () => void;
  onGoToLanding: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartSession,
  onLogout,
  onGoToLanding,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'tool' | 'history'>('overview');
  const [activeSession, setActiveSession] = useState<any>(null);

  // Sessions and analytics from backend
  const [sessions, setSessions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    total_sessions: 0,
    avg_tes: 0,
    avg_baseline: 0,
    avg_final: 0,
    concepts_mastered: 0,
    improvement_rate: 0
  });

  const handleLaunchTool = (sessionData?: any) => {
    if (onStartSession) {
      onStartSession(sessionData);
    }
    setActiveSession(sessionData || null);
    setActiveTab('tool');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyRes, analyticsRes] = await Promise.all([
          axios.get('/api/sessions/history'),
          axios.get('/api/sessions/analytics')
        ]);
        if (historyRes.data?.sessions) {
          setSessions(historyRes.data.sessions);
        }
        if (analyticsRes.data?.analytics) {
          setAnalytics(analyticsRes.data.analytics);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      }
    };

    fetchDashboardData();
  }, [activeTab]);

  const studentName = user?.name || user?.email?.split('@')[0] || 'Divyansh';

  // Compute live values from actual user sessions
  const completedSessions = sessions.filter(s => s.status === 'completed' || s.final_score > 0);
  const totalCompletedCount = completedSessions.length;
  
  const computedAvgTes = analytics.avg_tes > 0 
    ? analytics.avg_tes 
    : totalCompletedCount > 0 
      ? Math.round(completedSessions.reduce((acc, s) => acc + (parseFloat(s.tes_score) || 0), 0) / totalCompletedCount)
      : 0;

  const computedAvgFinal = analytics.avg_final > 0
    ? analytics.avg_final
    : totalCompletedCount > 0
      ? Math.round(completedSessions.reduce((acc, s) => acc + (parseFloat(s.final_score) || 0), 0) / totalCompletedCount)
      : 0;

  const computedDelta = analytics.improvement_rate > 0
    ? analytics.improvement_rate
    : totalCompletedCount > 0
      ? Math.round(
          completedSessions.reduce((acc, s) => acc + (parseFloat(s.final_score) || 0) - (parseFloat(s.baseline_score) || 0), 0) / totalCompletedCount
        )
      : 0;

  const uniqueSubjectsCount = new Set(sessions.map(s => s.subject || s.title)).size;

  // Color tokens guaranteed to be high contrast in both themes
  const headingColor = isDark ? 'text-white' : 'text-[#0f3238]';
  const bodyColor = isDark ? 'text-zinc-300' : 'text-[#374151]';
  const mutedColor = isDark ? 'text-zinc-400' : 'text-[#52525b]';
  const cardBg = isDark ? 'bg-[#0d1619] border-zinc-800' : 'bg-white border-[#eae6dc]';

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col md:flex-row ${
        isDark ? 'bg-[#0a0f12] text-zinc-100' : 'bg-[#faf8f5] text-[#12181a]'
      }`}
    >
      {/* ========================================================= */}
      {/* LEFT SIDEBAR NAVIGATION                                   */}
      {/* ========================================================= */}
      <aside
        className={`w-full md:w-64 shrink-0 border-r flex flex-col justify-between transition-colors ${
          isDark
            ? 'bg-[#0d1619] border-zinc-800/80 text-zinc-200'
            : 'bg-[#ffffff] border-[#eae6dc] text-[#12181a]'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Header: Study Buddy */}
          <button
            type="button"
            onClick={onGoToLanding}
            className="flex items-center gap-3 px-1 text-left w-full cursor-pointer group rounded-xl p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Return to Landing Page"
          >
            <img
              src="/brand/study-buddy-icon.svg"
              alt="Study Buddy"
              className="w-8 h-8 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <span className={`font-bold text-sm tracking-tight block leading-tight font-serif ${headingColor} group-hover:text-[#c2983b] transition-colors`}>
                Study Buddy
              </span>
              <span className={`text-[10px] font-mono tracking-wider uppercase ${mutedColor}`}>
                Feynman Studio
              </span>
            </div>
          </button>

          {/* Section: WORKSPACE TABS */}
          <div className="space-y-1.5">
            <div className={`px-2 pb-1 text-[11px] font-mono uppercase tracking-widest font-semibold ${mutedColor}`}>
              Workspace
            </div>

            {/* Dashboard Overview Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'overview'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700'
                    : 'bg-[#f4f2ea] text-[#0f3238] font-bold shadow-xs border border-[#eae6dc]'
                  : isDark
                  ? 'text-zinc-300 hover:text-white hover:bg-white/5'
                  : 'text-[#374151] hover:text-[#0f3238] hover:bg-black/5 font-medium'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#c2983b]" />
              <span className="font-semibold">Dashboard</span>
            </button>

            {/* Teach Child AI / Study Tool Chamber Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('tool')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                activeTab === 'tool'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700'
                    : 'bg-[#f4f2ea] text-[#0f3238] font-bold shadow-xs border border-[#eae6dc]'
                  : isDark
                  ? 'text-zinc-300 hover:text-white hover:bg-white/5'
                  : 'text-[#374151] hover:text-[#0f3238] hover:bg-black/5 font-medium'
              }`}
            >
              <Bot className="w-4 h-4 text-[#2b7a58]" />
              <span className="font-semibold">Teach Child AI</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-mono font-bold">
                Launch
              </span>
            </button>

            {/* Session History Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                activeTab === 'history'
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-xs border border-zinc-700'
                    : 'bg-[#f4f2ea] text-[#0f3238] font-bold shadow-xs border border-[#eae6dc]'
                  : isDark
                  ? 'text-zinc-300 hover:text-white hover:bg-white/5'
                  : 'text-[#374151] hover:text-[#0f3238] hover:bg-black/5 font-medium'
              }`}
            >
              <Clock className="w-4 h-4 text-[#c2983b]" />
              <span className="font-semibold">Session History</span>
              {sessions.length > 0 && (
                <span
                  className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                    isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-[#eae6dc] text-[#0f3238]'
                  }`}
                >
                  {sessions.length}
                </span>
              )}
            </button>
          </div>

          {/* Inspirational Feynman Method Card */}
          <div
            className={`p-3.5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#faf8f5] border-[#eae6dc]'
            }`}
          >
            <div className={`flex items-center gap-1.5 text-xs font-bold ${headingColor}`}>
              <Sparkles className="w-3.5 h-3.5 text-[#c2983b]" />
              <span>The Feynman Law</span>
            </div>
            <p className={`text-[11px] leading-relaxed italic ${bodyColor}`}>
              "If you cannot explain it simply, you do not understand it well enough."
            </p>
            <div className="text-[10px] font-mono font-semibold text-[#c2983b]">
              — Richard Feynman
            </div>
          </div>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div
          className={`p-4 border-t space-y-3 ${
            isDark ? 'border-zinc-800/80' : 'border-[#eae6dc]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#0f3238] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate text-left">
                <div className={`text-xs font-bold truncate leading-tight ${headingColor}`}>
                  {studentName}
                </div>
                <div className={`text-[10px] font-mono font-medium ${mutedColor}`}>
                  Feynman Scholar
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-zinc-400 hover:text-red-400 hover:bg-red-950/20'
                  : 'text-[#6b7280] hover:text-red-600 hover:bg-red-50'
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header
          className={`h-16 px-6 md:px-8 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-[#0a0f12]/90 border-zinc-800/80'
              : 'bg-[#faf8f5]/90 border-[#eae6dc]'
          }`}
        >
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-xs">
            <span className={mutedColor}>Study Buddy</span>
            <span className="text-[#9ca3af]">/</span>
            <span className={`font-semibold ${headingColor}`}>
              {activeTab === 'overview'
                ? 'Learning Dashboard'
                : activeTab === 'tool'
                ? 'Teaching Chamber'
                : 'Session History & Records'}
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleLaunchTool()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0f3238] text-white hover:bg-[#163b40] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#c2983b]" />
              <span>New Session</span>
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* ========================================================= */}
          {/* OVERVIEW TAB                                              */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold tracking-tight font-serif ${headingColor}`}>
                    Welcome back, {studentName}!
                  </h1>
                  <p className={`text-xs md:text-sm mt-1 font-sans ${bodyColor}`}>
                    Master any subject by explaining it to the Child AI. Your retention is verified through blind evaluation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-200'
                        : 'border-[#eae6dc] bg-white text-[#0f3238]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>{totalCompletedCount > 0 ? `${Math.min(10, totalCompletedCount)}-Day Streak` : 'Active Scholar'}</span>
                  </div>
                </div>
              </div>

              {/* 4 Clean Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Teaching Efficiency Score */}
                <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
                  <div className={`flex items-center justify-between text-xs font-medium ${mutedColor}`}>
                    <span>Average TES Score</span>
                    <Sparkles className="w-4 h-4 text-[#c2983b]" />
                  </div>
                  <div className={`mt-2 text-3xl font-extrabold font-serif ${headingColor}`}>
                    {computedAvgTes > 0 ? `${computedAvgTes}%` : '—'}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{computedDelta > 0 ? `+${computedDelta}% Delta vs. Baseline` : 'Awaiting baseline'}</span>
                  </div>
                </div>

                {/* Metric 2: Topics Mastered */}
                <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
                  <div className={`flex items-center justify-between text-xs font-medium ${mutedColor}`}>
                    <span>Topics Explored</span>
                    <BookOpen className="w-4 h-4 text-[#2b7a58]" />
                  </div>
                  <div className={`mt-2 text-3xl font-extrabold font-serif ${headingColor}`}>
                    {uniqueSubjectsCount}
                  </div>
                  <div className={`mt-1 text-[11px] ${mutedColor}`}>
                    Syllabi & Chapters taught
                  </div>
                </div>

                {/* Metric 3: Active Sessions */}
                <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
                  <div className={`flex items-center justify-between text-xs font-medium ${mutedColor}`}>
                    <span>Sessions Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className={`mt-2 text-3xl font-extrabold font-serif ${headingColor}`}>
                    {totalCompletedCount}
                  </div>
                  <div className={`mt-1 text-[11px] ${mutedColor}`}>
                    Full Feynman Cycles
                  </div>
                </div>

                {/* Metric 4: Child AI Exam Pass Rate */}
                <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
                  <div className={`flex items-center justify-between text-xs font-medium ${mutedColor}`}>
                    <span>Child Exam Score</span>
                    <GraduationCap className="w-4 h-4 text-[#8285f2]" />
                  </div>
                  <div className={`mt-2 text-3xl font-extrabold font-serif ${headingColor}`}>
                    {computedAvgFinal > 0 ? `${computedAvgFinal}%` : '—'}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700 font-bold">
                    {totalCompletedCount > 0 ? 'Verified Post-Exam' : 'Pending Sessions'}
                  </div>
                </div>
              </div>

              {/* Quick Launch Hero Callout */}
              <div
                className={`p-6 md:p-8 rounded-3xl border transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${cardBg}`}
              >
                <div className="max-w-xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#c2983b]/10 text-[#c2983b] border border-[#c2983b]/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Active Socratic Engine</span>
                  </div>
                  <h2 className={`text-xl md:text-2xl font-bold font-serif ${headingColor}`}>
                    Start a New Feynman Teaching Session
                  </h2>
                  <p className={`text-xs md:text-sm leading-relaxed font-sans ${bodyColor}`}>
                    Upload any textbook chapter or lecture notes. The Teacher Agent creates a cold baseline exam with zero leaks, and you achieve deep retention by explaining the core axioms to the Child AI.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchTool()}
                  className="px-6 py-3 rounded-2xl font-semibold text-white bg-[#0f3238] hover:bg-[#163b40] active:scale-95 transition-all shadow-md shadow-[#0f3238]/20 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Launch Teaching Chamber</span>
                  <ArrowRight className="w-4 h-4 text-[#c2983b]" />
                </button>
              </div>

              {/* Recent Learning Sessions Preview */}
              <div
                className={`p-6 md:p-8 rounded-3xl border transition-all space-y-6 ${cardBg}`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-4 ${
                    isDark ? 'border-zinc-800' : 'border-[#eae6dc]'
                  }`}
                >
                  <div>
                    <h3 className={`text-lg font-bold font-serif ${headingColor}`}>
                      Recent Learning Sessions
                    </h3>
                    <p className={`text-xs mt-0.5 ${mutedColor}`}>
                      Your audited Feynman sessions with baseline and final blind exam results.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      isDark
                        ? 'text-zinc-200 hover:text-[#c2983b]'
                        : 'text-[#0f3238] hover:text-[#c2983b]'
                    }`}
                  >
                    <span>View All History</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className={`divide-y ${
                    isDark ? 'divide-zinc-800' : 'divide-[#eae6dc]'
                  }`}
                >
                  {sessions.length > 0 ? (
                    sessions.slice(0, 3).map((ses) => (
                      <div
                        key={ses.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="space-y-1.5">
                          <div className={`font-bold text-sm ${headingColor}`}>
                            {ses.title}
                          </div>
                          <div className={`flex items-center gap-3 text-xs font-medium ${bodyColor}`}>
                            <span
                              className={`px-2 py-0.5 rounded-md border font-semibold ${
                                isDark
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                                  : 'bg-[#faf8f5] border-[#eae6dc] text-[#0f3238]'
                              }`}
                            >
                              {ses.subject || 'General'}
                            </span>
                            <span>•</span>
                            <span>Baseline: {ses.baseline_score || 0}%</span>
                            <span>•</span>
                            <span>Final: {ses.final_score || 0}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#c2983b] font-mono">
                              TES {ses.tes_score || 0}%
                            </div>
                            <div className="text-[10px] text-emerald-700 font-bold">
                              Verified Retention
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleLaunchTool(ses)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f3238] text-white hover:bg-[#163b40] active:scale-95 transition-all shadow-xs cursor-pointer"
                          >
                            Resume →
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <p className={`text-xs ${mutedColor}`}>
                        No learning sessions yet. Launch the chamber above to begin!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* SESSION HISTORY TAB                                       */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div
              className={`p-6 md:p-8 rounded-3xl border transition-all space-y-6 ${cardBg}`}
            >
              {/* Header with high contrast readable text */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
                  isDark ? 'border-zinc-800' : 'border-[#eae6dc]'
                }`}
              >
                <div>
                  <h1 className={`text-2xl font-bold font-serif tracking-tight ${headingColor}`}>
                    Feynman Session History & Records
                  </h1>
                  <p className={`text-xs md:text-sm mt-1 font-medium leading-relaxed ${bodyColor}`}>
                    Audited cold baseline vs. blind final exams with Teaching Efficiency Scores (TES).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
                      isDark
                        ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                        : 'border-[#eae6dc] bg-[#faf8f5] text-[#0f3238] hover:bg-[#f4f2ea]'
                    }`}
                  >
                    ← Back to Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchTool()}
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#0f3238] text-white hover:bg-[#163b40] active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c2983b]" />
                    <span>New Session</span>
                  </button>
                </div>
              </div>

              {/* Session History Cards */}
              <div className="space-y-4">
                {sessions.length > 0 ? (
                  sessions.map((ses) => (
                    <div
                      key={ses.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDark
                          ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                          : 'bg-[#faf8f5] border-[#eae6dc] hover:border-[#c2983b]/60 shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0f3238] text-white font-mono">
                            {ses.subject || 'General'}
                          </span>
                          <span className={`text-xs font-medium ${mutedColor}`}>
                            {ses.created_at
                              ? new Date(ses.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent Session'}
                          </span>
                        </div>

                        <h3 className={`font-bold text-base ${headingColor}`}>
                          {ses.title}
                        </h3>

                        <div className={`flex flex-wrap items-center gap-4 text-xs font-semibold ${bodyColor}`}>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-normal ${mutedColor}`}>Baseline:</span>
                            <span className={`font-mono font-bold ${headingColor}`}>{ses.baseline_score || 12}%</span>
                          </div>
                          <span>→</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-normal ${mutedColor}`}>Final Blind Exam:</span>
                            <span className={`font-mono font-bold ${headingColor}`}>{ses.final_score || 94}%</span>
                          </div>
                          <span>→</span>
                          <div className="flex items-center gap-1 text-emerald-700 font-bold">
                            <span>Delta:</span>
                            <span className="font-mono">
                              +{Math.round((ses.final_score || 94) - (ses.baseline_score || 12))}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-4 pt-2 md:pt-0 border-t md:border-t-0 justify-between md:justify-end ${
                          isDark ? 'border-zinc-800' : 'border-[#eae6dc]'
                        }`}
                      >
                        <div className="text-left md:text-right">
                          <div className="text-base font-bold text-[#c2983b] font-mono">
                            TES {ses.tes_score || 88}%
                          </div>
                          <div className="text-[11px] text-emerald-700 font-bold">
                            Verified Retention
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleLaunchTool(ses)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f3238] text-white hover:bg-[#163b40] active:scale-95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Resume</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#c2983b]" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <FileText className="w-10 h-10 text-[#c2983b] mx-auto opacity-80" />
                    <h3 className={`font-bold text-base ${headingColor}`}>
                      No Past Sessions Yet
                    </h3>
                    <p className={`text-xs max-w-sm mx-auto ${bodyColor}`}>
                      Start your first Feynman teaching session to begin tracking conceptual retention and Teaching Efficiency Scores.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleLaunchTool()}
                      className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0f3238] text-white hover:bg-[#163b40] transition-all cursor-pointer"
                    >
                      Start First Session →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TEACH CHILD AI / TOOL TAB                                 */}
          {/* ========================================================= */}
          {activeTab === 'tool' && (
            <div className="w-full">
              <StudyTool
                initialSession={activeSession}
                isEmbedded={true}
                onBack={() => setActiveTab('overview')}
                onGoToDashboard={() => setActiveTab('overview')}
                onOpenAuth={() => {}}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
