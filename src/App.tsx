import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Games } from './components/Games/Games';

function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'games'>('general');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'general' && <Feed category="general" />}
          {activeTab === 'games' && <Games />}
        </main>
      </div>
    </Router>
  );
}

export default App;