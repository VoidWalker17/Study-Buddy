"use client";

import React, { useState } from "react";
import { Brain, Sparkles, ArrowRight, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ThemeToggle } from "../ThemeToggle";

interface FullScreenSignupProps {
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
  onBackToHome?: () => void;
}

export const FullScreenSignup: React.FC<FullScreenSignupProps> = ({
  initialMode = "login",
  onSuccess,
  onBackToHome,
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    let valid = true;

    if (!isLogin && !name.trim()) {
      setNameError("Please enter your full name.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          onSuccess?.();
        } else {
          setServerError(res.error || "Invalid email or password.");
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          onSuccess?.();
        } else {
          setServerError(res.error || "Failed to create account.");
        }
      }
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail("divyansh@studybuddy.ai");
    setPassword("Password123!");
    setEmailError("");
    setPasswordError("");
    setServerError(null);
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 ${
        isDark ? "bg-[#070d0f] text-zinc-100" : "bg-[#f5f4ee] text-[#10292d]"
      }`}
    >
      {/* Top Controls: Back and Theme Toggle */}
      <div className="fixed top-6 left-6 z-50">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all cursor-pointer ${
              isDark
                ? "bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                : "bg-white/80 border-[#e2e0d6] text-[#66726f] hover:text-[#10292d] hover:bg-white"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        )}
      </div>

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Split-Screen Container */}
      <div
        className={`w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row rounded-3xl border shadow-2xl transition-all ${
          isDark
            ? "bg-[#0c1518] border-zinc-800 shadow-black/60"
            : "bg-white border-[#e2e0d6] shadow-[0_30px_70px_-20px_rgba(16,41,45,0.15)]"
        }`}
      >
        {/* Left Side: Editorial Sculptural / Atmospheric Visual Pane */}
        <div className="relative p-8 md:p-12 md:w-1/2 flex flex-col justify-between overflow-hidden bg-[#181d1e] text-[#eef2ec] min-h-[580px]">
          {/* High-Aesthetic 3D Kinetic Sculpture Background */}
          <img
            src="/assets/auth-sculpture.jpg"
            srcSet="/assets/auth-sculpture@2x.jpg 2x"
            alt="Study Buddy Neural Kinetic Sculpture"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Calibrated Studio Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1518]/90 via-black/35 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/50 pointer-events-none" />

          {/* Top Brand Tag with Backdrop Blur */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-[#8c7b33] flex items-center justify-center text-white shadow-md shadow-[#8c7b33]/40">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block leading-tight">Study Buddy</span>
                <span className="text-[10px] text-[#93aaa6] tracking-wider uppercase font-mono">
                  Neural Feynman Engine
                </span>
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-black/50 text-[#d4a743] border border-[#8c7b33]/40 backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Active Synthesis
            </div>
          </div>

          {/* Center Space: Visual breathing room so the chrome sphere & golden coil shine */}
          <div className="relative z-10 my-auto py-10" />

          {/* Bottom Content / Statement */}
          <div className="relative z-10 mt-auto space-y-4">
            {/* Elegant Glassmorphic Quote Card */}
            <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl space-y-2.5">
              <p className="text-lg sm:text-xl font-normal tracking-tight leading-snug text-white font-serif italic">
                "If you cannot explain it simply, you do not understand it well enough."
              </p>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                <span className="text-[#93aaa6] font-medium">— Richard P. Feynman</span>
                <span className="text-[11px] text-[#d4a743] font-mono">Nobel Laureate, 1965</span>
              </div>
            </div>

            {/* Quick Demo Fill Button & Model Architecture */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleUseDemo}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              >
                <span>⚡ Auto-fill Demo Scholar</span>
              </button>
              <span className="text-[11px] text-zinc-300/80 font-mono">
                120B / 20B Dual-Agent
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: The Form Pane */}
        <div
          className={`p-8 md:p-12 md:w-1/2 flex flex-col justify-center transition-colors ${
            isDark ? "bg-[#0c1518]" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex p-1 rounded-xl border bg-slate-100/80 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setServerError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    isLogin
                      ? isDark
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "bg-white text-[#10292d] shadow-sm font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setServerError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    !isLogin
                      ? isDark
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "bg-white text-[#10292d] shadow-sm font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {isLogin ? "Welcome back" : "Begin your learning journey"}
            </h2>
            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-[#66726f]"}`}>
              {isLogin
                ? "Enter your credentials to access your Feynman sessions and analytics."
                : "Register for free to track your Teaching Efficiency Score (TES) across topics."}
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl text-xs font-medium bg-red-500/10 border border-red-500/25 text-red-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <span className="leading-relaxed">{serverError}</span>
              {serverError.toLowerCase().includes("already exists") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setServerError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-semibold cursor-pointer text-xs whitespace-nowrap shadow-sm"
                >
                  Switch to Sign In →
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Richard Feynman"
                  className={`text-sm w-full py-2.5 px-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800 text-zinc-100 focus:border-[#8c7b33] focus:ring-[#8c7b33]/20"
                      : "bg-[#f5f4ee]/50 border-[#e2e0d6] text-[#10292d] focus:border-[#0f3238] focus:ring-[#0f3238]/10"
                  } ${nameError ? "border-red-500" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!nameError}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1.5">{nameError}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="student@university.edu"
                className={`text-sm w-full py-2.5 px-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDark
                    ? "bg-zinc-900/60 border-zinc-800 text-zinc-100 focus:border-[#8c7b33] focus:ring-[#8c7b33]/20"
                    : "bg-[#f5f4ee]/50 border-[#e2e0d6] text-[#10292d] focus:border-[#0f3238] focus:ring-[#0f3238]/10"
                } ${emailError ? "border-red-500" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}
                >
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to registered email.")}
                    className="text-xs text-[#8c7b33] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  className={`text-sm w-full py-2.5 px-3.5 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800 text-zinc-100 focus:border-[#8c7b33] focus:ring-[#8c7b33]/20"
                      : "bg-[#f5f4ee]/50 border-[#e2e0d6] text-[#10292d] focus:border-[#0f3238] focus:ring-[#0f3238]/10"
                  } ${passwordError ? "border-red-500" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0f3238] focus:ring-[#0f3238] cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className={`text-xs cursor-pointer select-none ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}
                >
                  Remember this device for 30 days
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isDark
                  ? "bg-[#8c7b33] hover:bg-[#a8963f] text-white shadow-[#8c7b33]/20"
                  : "bg-[#0f3238] hover:bg-[#15464f] text-white shadow-[#0f3238]/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  {isLogin ? "Sign In to Dashboard" : "Create Feynman Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2 text-xs text-slate-500 dark:text-zinc-400">
              {isLogin ? "Don't have an account yet? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setServerError(null);
                }}
                className="font-semibold underline text-[#8c7b33] hover:text-[#a8963f] cursor-pointer"
              >
                {isLogin ? "Create one here" : "Sign in here"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FullScreenSignup;
