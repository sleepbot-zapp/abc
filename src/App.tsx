import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Communities } from './components/Community/Communities';
import { Games } from './components/Games/Games';

function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'community' | 'games'>('general');

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
          flair: "discussion",
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
          content: "Anyone else think modern skyscrapers are getting too generic? Every city is starting to look the same with these glass boxes.",
          author_name: "ArchAnon",
          category: "general",
          flair: "query",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          post_number: 123456788,
          comments: []
        },
        {
          id: crypto.randomUUID(),
          content: "I think we should incorporate more sustainable materials in modern construction. Here's my proposal for using bamboo and recycled steel in residential projects.",
          author_name: "EcoBuilder",
          category: "general",
          flair: "suggestion",
          created_at: new Date(Date.now() - 10800000).toISOString(),
          post_number: 123456787,
          comments: []
        },
        {
          id: crypto.randomUUID(),
          content: "Just finished my latest residential project! Mixed traditional Japanese elements with modern minimalism. What do you think?",
          author_name: "DesignAnon",
          category: "general",
          flair: "showcase",
          created_at: new Date(Date.now() - 14400000).toISOString(),
          post_number: 123456786,
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
          {activeTab === 'general' && <Feed category="general" />}
          {activeTab === 'community' && <Communities />}
          {activeTab === 'games' && <Games />}
        </main>
      </div>
    </Router>
  );
}

export default App;