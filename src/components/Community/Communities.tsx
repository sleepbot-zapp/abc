import React, { useState, useEffect } from 'react';
import { Plus, Users, MessageCircle, Calendar, Hash, ArrowRight } from 'lucide-react';
import { CommunityThreads } from './CommunityThreads';

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  created_by: string;
  created_at: string;
  thread_count: number;
  member_count: number;
  last_activity: string;
}

export const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: ''
  });

  const categories = [
    'Sustainable Design',
    'Urban Planning', 
    'Residential',
    'Commercial',
    'Interior Design',
    'Landscape Architecture',
    'Historic Preservation',
    'Technology & BIM',
    'Construction',
    'Theory & Criticism'
  ];

  const fetchCommunities = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('anon_communities') || '[]');
      setCommunities(stored);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const community: Community = {
        id: crypto.randomUUID(),
        name: newCommunity.name.trim(),
        description: newCommunity.description.trim(),
        category: newCommunity.category.trim() || 'General',
        created_by: 'Anonymous',
        created_at: new Date().toISOString(),
        thread_count: 0,
        member_count: 1,
        last_activity: new Date().toISOString()
      };

      const communities = JSON.parse(localStorage.getItem('anon_communities') || '[]');
      communities.unshift(community);
      localStorage.setItem('anon_communities', JSON.stringify(communities));

      setNewCommunity({ name: '', description: '', category: '' });
      setShowCreateForm(false);
      fetchCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const joinCommunity = (community: Community) => {
    setSelectedCommunity(community);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  useEffect(() => {
    fetchCommunities();
    
    // Initialize with sample communities if none exist
    const existing = localStorage.getItem('anon_communities');
    if (!existing) {
      const sampleCommunities: Community[] = [
        {
          id: crypto.randomUUID(),
          name: 'Sustainable Architecture',
          description: 'Discussing eco-friendly building practices, green materials, and energy-efficient designs',
          category: 'Sustainable Design',
          created_by: 'Anonymous',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          thread_count: 23,
          member_count: 156,
          last_activity: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: crypto.randomUUID(),
          name: 'Modern Residential Design',
          description: 'Contemporary home design trends, minimalism, and innovative residential solutions',
          category: 'Residential',
          created_by: 'Anonymous',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          thread_count: 41,
          member_count: 203,
          last_activity: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: crypto.randomUUID(),
          name: 'BIM & Digital Tools',
          description: 'Software discussions, BIM workflows, parametric design, and digital fabrication',
          category: 'Technology & BIM',
          created_by: 'Anonymous',
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          thread_count: 67,
          member_count: 89,
          last_activity: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: crypto.randomUUID(),
          name: 'Urban Planning Theory',
          description: 'City design principles, zoning, transportation planning, and urban development',
          category: 'Urban Planning',
          created_by: 'Anonymous',
          created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
          thread_count: 18,
          member_count: 72,
          last_activity: new Date(Date.now() - 14400000).toISOString()
        }
      ];
      localStorage.setItem('anon_communities', JSON.stringify(sampleCommunities));
      setCommunities(sampleCommunities);
    }
  }, []);

  // Show threads view when a community is selected
  if (selectedCommunity) {
    return (
      <CommunityThreads 
        community={selectedCommunity} 
        onBack={() => setSelectedCommunity(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 animate-pulse">
          <div className="h-8 bg-blue-100 rounded mb-2"></div>
          <div className="h-4 bg-blue-100 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-300 rounded p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 font-mono mb-1">/c/ - Community Spaces</h2>
            <p className="text-blue-600 font-mono text-sm">Specialized discussion areas for focused topics</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Space
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 font-mono mb-4">Create New Community Space</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description"
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              className="w-full h-24 p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <select
              value={newCommunity.category}
              onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-mono text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
              >
                Create Space
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
        <h3 className="font-bold text-yellow-800 font-mono text-sm mb-1">Community Guidelines</h3>
        <ul className="text-xs text-yellow-700 font-mono">
          <li>• Stay on topic within each community space</li>
          <li>• Respect community focus and purpose</li>
          <li>• Use appropriate flairs for your posts</li>
          <li>• Keep discussions constructive and professional</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((community) => (
          <div key={community.id} className="bg-white border border-gray-300 rounded p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800 font-mono">{community.name}</h3>
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono mb-2">
                  {community.category}
                </span>
                <p className="text-gray-600 text-sm font-mono leading-relaxed mb-3">
                  {community.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{community.thread_count} threads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{community.member_count} members</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatTimeAgo(community.last_activity)}</span>
              </div>
            </div>
            
            <button
              onClick={() => joinCommunity(community)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
            >
              Enter Space
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {communities.length === 0 && (
          <div className="col-span-full bg-white border border-gray-300 rounded p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-mono">No community spaces yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};