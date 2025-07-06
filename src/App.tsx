import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Games } from './components/Games/Games';
import { Communities } from './components/Community/Communities';

function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'games' | 'communities'>('general');

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <Header />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'general' && <Feed category="general" />}
            {activeTab === 'games' && <Games />}
            {activeTab === 'communities' && <Communities />}
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;