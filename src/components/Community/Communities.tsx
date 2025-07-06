import React, { useState, useEffect } from 'react';
import { getCommunities, getUsers, getCurrentUser, joinCommunity, createCommunity, Community } from '../../lib/localStorage';
import { Users, Plus, Building2, MapPin, Calendar } from 'lucide-react';

export const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: ''
  });
  const currentUser = getCurrentUser();
  const users = getUsers();

  const fetchCommunities = () => {
    try {
      const allCommunities = getCommunities();
      setCommunities(allCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = (communityId: string) => {
    if (!currentUser) {
      alert('Please sign in to join communities');
      return;
    }

    try {
      joinCommunity(communityId, currentUser.id);
      fetchCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleCreateCommunity = () => {
    if (!currentUser) {
      alert('Please sign in to create communities');
      return;
    }

    if (!newCommunity.name.trim() || !newCommunity.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      createCommunity({
        name: newCommunity.name.trim(),
        description: newCommunity.description.trim(),
        category: newCommunity.category.trim() || 'General',
        created_by: currentUser.id
      });

      setNewCommunity({ name: '', description: '', category: '' });
      setShowCreateForm(false);
      fetchCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 animate-pulse">
              <div className="h-48 bg-slate-200 rounded-t-2xl"></div>
              <div className="p-6">
                <div className="h-6 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Professional Communities</h2>
          <p className="text-slate-600">Connect with architects and professionals worldwide</p>
        </div>
        {currentUser && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Community
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Community</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <textarea
              placeholder="Community Description"
              value={newCommunity.description}
              onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
              className="w-full h-24 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
            />
            <input
              type="text"
              placeholder="Category (e.g., Sustainable Design, Urban Planning)"
              value={newCommunity.category}
              onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                Create Community
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => {
          const creator = users.find(u => u.id === community.created_by);
          const isMember = currentUser ? community.members.includes(currentUser.id) : false;
          
          return (
            <div key={community.id} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-slate-600 to-slate-800 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">{community.name}</h3>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {community.category}
                  </span>
                </div>
                <p className="text-slate-600 mb-4 line-clamp-3">{community.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    <span>{community.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                  </div>
                  {creator && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span>Founded by {creator.full_name}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleJoinCommunity(community.id)}
                  disabled={isMember || !currentUser}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    isMember
                      ? 'bg-green-100 text-green-800 cursor-default'
                      : currentUser
                      ? 'bg-slate-800 text-white hover:bg-slate-900'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isMember ? 'Joined' : currentUser ? 'Join Community' : 'Sign in to Join'}
                </button>
              </div>
            </div>
          );
        })}
        
        {communities.length === 0 && (
          <div className="col-span-full bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No communities yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};