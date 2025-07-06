import React, { useState, useEffect } from 'react';
import { Users, Plus, Building2, MapPin, Calendar } from 'lucide-react';

export const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: ''
  });

  const fetchCommunities = () => {
    try {
      const storedCommunities = JSON.parse(localStorage.getItem('anon_communities') || '[]');
      setCommunities(storedCommunities);
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
      const community = {
        id: crypto.randomUUID(),
        name: newCommunity.name.trim(),
        description: newCommunity.description.trim(),
        category: newCommunity.category.trim() || 'General',
        created_by: 'Anonymous',
        created_at: new Date().toISOString(),
        members: 1
      };

      const communities = JSON.parse(localStorage.getItem('anon_communities') || '[]');
      communities.push(community);
      localStorage.setItem('anon_communities', JSON.stringify(communities));

      setNewCommunity({ name: '', description: '', category: '' });
      setShowCreateForm(false);
      fetchCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  useEffect(() => {
    fetchCommunities();
    
    // Initialize with sample communities if none exist
    const existingCommunities = localStorage.getItem('anon_communities');
    if (!existingCommunities) {
      const sampleCommunities = [
        {
          id: crypto.randomUUID(),
          name: "Sustainable Architecture",
          description: "Discussing eco-friendly and sustainable building practices",
          category: "Environment",
          created_by: "Anonymous",
          created_at: new Date().toISOString(),
          members: 42
        },
        {
          id: crypto.randomUUID(),
          name: "Urban Planning",
          description: "City design, zoning, and urban development strategies",
          category: "Planning",
          created_by: "Anonymous",
          created_at: new Date().toISOString(),
          members: 38
        }
      ];
      localStorage.setItem('anon_communities', JSON.stringify(sampleCommunities));
      setCommunities(sampleCommunities);
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-gray-300 rounded p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
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
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 font-mono mb-1">/c/ - Communities</h2>
            <p className="text-blue-600 font-mono text-sm">Anonymous community boards and discussion groups</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Board
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 font-mono mb-4">Create New Community Board</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Board Name"
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Board Description"
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              className="w-full h-24 p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <input
              type="text"
              placeholder="Category (e.g., Sustainable Design, Urban Planning)"
              value={newCommunity.category}
              onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
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
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div key={community.id} className="bg-white border border-gray-300 rounded overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800 font-mono">{community.name}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                  {community.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm font-mono leading-relaxed">{community.description}</p>
              
              <div className="space-y-2 mb-4 text-xs text-gray-500 font-mono">
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>{community.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>Founded by {community.created_by}</span>
                </div>
              </div>
              
              <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm">
                Enter Board
              </button>
            </div>
          </div>
        ))}
        
        {communities.length === 0 && (
          <div className="col-span-full bg-white border border-gray-300 rounded p-8 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-mono">No community boards yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};