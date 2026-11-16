import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.error || 'Failed to sign in.');
        }
      } else {
        if (!name.trim()) {
          setError('Please provide your name.');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border overflow-hidden ${
            isDark
              ? 'bg-[#0c0c10] border-zinc-800 text-zinc-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 mb-3 shadow-inner">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              {isLogin
                ? 'Sign in to access your learning sessions & analytics'
                : 'Teach the AI and master your course material'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            className={`grid grid-cols-2 p-1 rounded-2xl mb-6 text-sm font-semibold border ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400'
                : 'bg-slate-100 border-slate-200/70 text-slate-600'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                isLogin
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow'
                    : 'bg-white text-slate-900 shadow-sm'
                  : 'hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                !isLogin
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow'
                    : 'bg-white text-slate-900 shadow-sm'
                  : 'hover:text-zinc-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Divyansh Agarwal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                      isDark
                        ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                    isDark
                      ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                    isDark
                      ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100 placeholder-zinc-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Teacher/Evaluation */}
          <div className={`mt-6 pt-4 border-t text-center text-xs ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'}`}>
            <span>Demo Account: </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setEmail('divyansh@studybuddy.ai');
                setPassword('Password123!');
              }}
              className="text-blue-500 hover:underline font-medium"
            >
              divyansh@studybuddy.ai / Password123!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
