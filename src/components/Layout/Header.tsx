import React from 'react';
import { Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white border-b-2 border-red-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono">/arch/ - Architecture</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-300" />
              <input
                type="text"
                placeholder="Search threads..."
                className="w-full pl-10 pr-4 py-1 bg-red-700 border border-red-500 rounded text-white placeholder-red-300 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
          
          <div className="text-sm font-mono">
            <span className="text-red-200">Anonymous Board</span>
          </div>
        </div>
      </div>
    </header>
  );
};