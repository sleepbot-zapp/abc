import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Communities } from './components/Community/Communities';
import { Games } from './components/Games/Games';

function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'suggestions' | 'improvements' | 'questions' | 'community' | 'games'>('general');

  // Initialize with some sample posts if none exist
  useEffect(() => {
    const existingPosts = localStorage.getItem('anon_posts');
    if (!existingPosts) {
      const samplePosts = [
        {
          id: crypto.randomUUID(),
          content: "What do you think about brutalist architecture? I've been studying some of Le Corbusier's work and I'm fascinated by the raw concrete aesthetic.",
          author_name: "Anonymous",
          category: "general",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          post_number: 123456789,
          comments: [
            {
              id: crypto.randomUUID(),
              content: "Brutalism gets a bad rap but some buildings are genuinely beautiful. The Barbican Centre in London is a masterpiece.",
              author_name: "Anonymous",
              created_at: new Date(Date.now() - 1800000).toISOString(),
              post_number: 123456790
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          content: "How about we start incorporating more green roofs in urban planning? It could help with air quality and temperature regulation.",
          author_name: "GreenArchitect",
          category: "suggestions",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          post_number: 123456788,
          comments: []
        }
      ];
      localStorage.setItem('anon_posts', JSON.stringify(samplePosts));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          {(activeTab === 'general' || activeTab === 'suggestions' || activeTab === 'improvements' || activeTab === 'questions') && 
            <Feed category={activeTab} />
          }
          {activeTab === 'community' && <Communities />}
          {activeTab === 'games' && <Games />}
        </main>
      </div>
    </Router>
  );
}

export default App;