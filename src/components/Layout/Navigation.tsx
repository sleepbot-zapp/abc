import React from 'react';
import { MessageSquare, GamepadIcon, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: 'general' | 'games' | 'communities';
  onTabChange: (tab: 'general' | 'games' | 'communities') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const boards = [
    { id: 'general', icon: <MessageSquare className="w-5 h-5" />, name: '/g/ - General', description: 'General Discussion' },
    { id: 'communities', icon: <Users className="w-5 h-5" />, name: '/c/ - Communities', description: 'Community Spaces' },
    { id: 'games', icon: <GamepadIcon className="w-5 h-5" />, name: '/v/ - Games', description: 'Games & Fun' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b-2 border-slate-800 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onTabChange(board.id as any)}
              className={`px-3 py-2 text-sm font-mono transition-colors whitespace-nowrap ${
                activeTab === board.id
                  ? 'bg-slate-800 dark:bg-slate-700 text-white'
                  : 'text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'
              }`}
              title={board.description}
            >
              <span className="hidden sm:inline">{board.name}</span>
              <span className="sm:hidden flex items-center gap-1">
                {board.icon}
                {board.name.split(' - ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};