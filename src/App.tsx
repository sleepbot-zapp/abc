import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Communities } from './components/Community/Communities';
import { Games } from './components/Games/Games';
import { initializeDefaultData } from './lib/localStorage';

function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'suggestions' | 'improvements' | 'questions' | 'community' | 'games'>('feed');

  useEffect(() => {
    // Initialize default data on app start
    initializeDefaultData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'feed' && <Feed category="feed" />}
          {activeTab === 'suggestions' && <Feed category="suggestion" />}
          {activeTab === 'improvements' && <Feed category="improvement" />}
          {activeTab === 'questions' && <Feed category="question" />}
          {activeTab === 'community' && <Communities />}
          {activeTab === 'games' && <Games />}
        </main>
      </div>
    </Router>
  );
}

export default App;