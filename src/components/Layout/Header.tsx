import React from 'react';
import { Search, Bell, Building2, User } from 'lucide-react';
import { getCurrentUser, signOut } from '../../lib/localStorage';

export const Header: React.FC = () => {
  const currentUser = getCurrentUser();

  const handleSignOut = () => {
    signOut();
    window.location.reload();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Architect's Society</h1>
              <p className="text-xs text-slate-600 hidden sm:block">Professional Community Platform</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, suggestions, improvements..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-slate-700">
                      {currentUser.full_name}
                    </span>
                    <p className="text-xs text-slate-500">{currentUser.profession || 'Architect'}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                  Guest User
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};