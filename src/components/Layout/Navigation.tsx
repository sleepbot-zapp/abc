import React from 'react';
import { Home, Users, GamepadIcon, Lightbulb, TrendingUp, HelpCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'feed' | 'suggestions' | 'improvements' | 'questions' | 'community' | 'games';
  onTabChange: (tab: 'feed' | 'suggestions' | 'improvements' | 'questions' | 'community' | 'games') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const TabButton = ({ 
    tab, 
    icon, 
    label 
  }: { 
    tab: 'feed' | 'suggestions' | 'improvements' | 'questions' | 'community' | 'games', 
    icon: React.ReactNode, 
    label: string 
  }) => (
    <button
      onClick={() => onTabChange(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === tab
          ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
          <TabButton tab="feed" icon={<Home className="w-5 h-5" />} label="Feed" />
          <TabButton tab="suggestions" icon={<Lightbulb className="w-5 h-5" />} label="Suggestions" />
          <TabButton tab="improvements" icon={<TrendingUp className="w-5 h-5" />} label="Improvements" />
          <TabButton tab="questions" icon={<HelpCircle className="w-5 h-5" />} label="Questions" />
          <TabButton tab="community" icon={<Users className="w-5 h-5" />} label="Communities" />
          <TabButton tab="games" icon={<GamepadIcon className="w-5 h-5" />} label="Games" />
        </div>
      </div>
    </nav>
  );
};