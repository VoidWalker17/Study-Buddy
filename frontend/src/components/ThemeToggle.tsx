import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${
        theme === 'dark'
          ? 'bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-zinc-800 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-slate-700" />
        )}
      </div>
    </button>
  );
};
