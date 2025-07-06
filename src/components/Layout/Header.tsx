import React from 'react';
import { Search, Moon, Sun, Building2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-slate-800 dark:bg-slate-950 text-white border-b-2 border-slate-700 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold font-mono">Architect's Society</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search threads..."
                className="w-full pl-10 pr-4 py-1 bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 dark:focus:border-slate-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-sm font-mono">
              <span className="text-slate-300">Anonymous Board</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};