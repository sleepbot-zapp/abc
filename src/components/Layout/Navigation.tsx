import React from 'react';
import { MessageSquare, GamepadIcon } from 'lucide-react';

interface NavigationProps {
  activeTab: 'general' | 'games';
  onTabChange: (tab: 'general' | 'games') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const boards = [
    { id: 'general', icon: <MessageSquare className="w-5 h-5" />, name: '/g/ - General', description: 'General Discussion' },
    { id: 'games', icon: <GamepadIcon className="w-5 h-5" />, name: '/v/ - Games', description: 'Games & Fun' }
  ];

  return (
    <nav className="bg-white border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onTabChange(board.id as any)}
              className={`px-3 py-2 text-sm font-mono transition-colors whitespace-nowrap ${
                activeTab === board.id
                  ? 'bg-red-600 text-white'
                  : 'text-blue-600 hover:bg-red-50 hover:text-red-600'
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