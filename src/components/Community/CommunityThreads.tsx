import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MessageCircle, Clock, User, Tag, Send } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  content: string;
  author_name: string;
  community_id: string;
  flair?: string;
  created_at: string;
  reply_count: number;
  last_reply: string;
  post_number: number;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  post_number: number;
}

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

interface CommunityThreadsProps {
  community: Community;
  onBack: () => void;
}

export const CommunityThreads: React.FC<CommunityThreadsProps> = ({ community, onBack }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    author_name: '',
    flair: ''
  });
  const [newReply, setNewReply] = useState({
    content: '',
    author_name: ''
  });

  const flairs = [
    { id: '', label: 'No Flair', color: '' },
    { id: 'discussion', label: 'Discussion', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'question', label: 'Question', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'showcase', label: 'Showcase', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'help', label: 'Help', color: 'bg-red-100 text-red-800 border-red-200' },
    { id: 'news', label: 'News', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { id: 'resource', label: 'Resource', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  ];

  const getFlairStyle = (flair: string) => {
    const flairObj = flairs.find(f => f.id === flair);
    return flairObj?.color || '';
  };

  const getFlairLabel = (flair: string) => {
    const flairObj = flairs.find(f => f.id === flair);
    return flairObj?.label || '';
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

  const fetchThreads = () => {
    try {
      const allThreads = JSON.parse(localStorage.getItem('community_threads') || '[]');
      const communityThreads = allThreads.filter((t: Thread) => t.community_id === community.id);
      setThreads(communityThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const thread: Thread = {
        id: crypto.randomUUID(),
        title: newThread.title.trim(),
        content: newThread.content.trim(),
        author_name: newThread.author_name.trim() || 'Anonymous',
        community_id: community.id,
        flair: newThread.flair,
        created_at: new Date().toISOString(),
        reply_count: 0,
        last_reply: new Date().toISOString(),
        post_number: Math.floor(Math.random() * 999999999) + 100000000,
        replies: []
      };

      const allThreads = JSON.parse(localStorage.getItem('community_threads') || '[]');
      allThreads.unshift(thread);
      localStorage.setItem('community_threads', JSON.stringify(allThreads));

      // Update community thread count
      const communities = JSON.parse(localStorage.getItem('anon_communities') || '[]');
      const communityIndex = communities.findIndex((c: Community) => c.id === community.id);
      if (communityIndex >= 0) {
        communities[communityIndex].thread_count += 1;
        communities[communityIndex].last_activity = new Date().toISOString();
        localStorage.setItem('anon_communities', JSON.stringify(communities));
      }

      setNewThread({ title: '', content: '', author_name: '', flair: '' });
      setShowCreateThread(false);
      fetchThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleReply = () => {
    if (!newReply.content.trim() || !selectedThread) return;

    try {
      const reply: Reply = {
        id: crypto.randomUUID(),
        content: newReply.content.trim(),
        author_name: newReply.author_name.trim() || 'Anonymous',
        created_at: new Date().toISOString(),
        post_number: Math.floor(Math.random() * 999999999) + 100000000
      };

      const allThreads = JSON.parse(localStorage.getItem('community_threads') || '[]');
      const threadIndex = allThreads.findIndex((t: Thread) => t.id === selectedThread.id);
      if (threadIndex >= 0) {
        allThreads[threadIndex].replies.push(reply);
        allThreads[threadIndex].reply_count += 1;
        allThreads[threadIndex].last_reply = new Date().toISOString();
        localStorage.setItem('community_threads', JSON.stringify(allThreads));
        
        setSelectedThread(allThreads[threadIndex]);
      }

      setNewReply({ content: '', author_name: '' });
      fetchThreads();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [community.id]);

  // Thread view
  if (selectedThread) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setSelectedThread(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {community.name}
            </button>
          </div>
          <h2 className="text-xl font-bold text-blue-800 font-mono mb-1">{selectedThread.title}</h2>
          <div className="flex items-center gap-4 text-xs text-blue-600 font-mono">
            <span>No.{selectedThread.post_number}</span>
            <span>{selectedThread.reply_count} replies</span>
            <span>{formatTimeAgo(selectedThread.created_at)}</span>
          </div>
        </div>

        {/* Original Post */}
        <div className="bg-white border border-gray-300 rounded mb-4">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-bold text-green-700 font-mono">{selectedThread.author_name}</span>
              <span className="text-sm text-gray-500 font-mono">{formatTimeAgo(selectedThread.created_at)}</span>
              <span className="text-sm text-blue-600 font-mono">No.{selectedThread.post_number}</span>
              {selectedThread.flair && (
                <span className={`px-2 py-1 text-xs font-mono border rounded ${getFlairStyle(selectedThread.flair)}`}>
                  {getFlairLabel(selectedThread.flair)}
                </span>
              )}
            </div>
            <div className="text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {selectedThread.content}
            </div>
          </div>
        </div>

        {/* Replies */}
        {selectedThread.replies.map((reply) => (
          <div key={reply.id} className="bg-gray-50 border border-gray-200 rounded mb-3 ml-8">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-green-700 font-mono">{reply.author_name}</span>
                <span className="text-sm text-gray-500 font-mono">{formatTimeAgo(reply.created_at)}</span>
                <span className="text-sm text-blue-600 font-mono">No.{reply.post_number}</span>
              </div>
              <div className="text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </div>
            </div>
          </div>
        ))}

        {/* Reply Form */}
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-bold text-gray-800 font-mono mb-3">Post Reply</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name (optional)"
                value={newReply.author_name}
                onChange={(e) => setNewReply({ ...newReply, author_name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <textarea
              placeholder="Reply"
              value={newReply.content}
              onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleReply}
                disabled={!newReply.content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
              >
                <Send className="w-4 h-4" />
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 animate-pulse">
          <div className="h-8 bg-blue-100 rounded mb-2"></div>
          <div className="h-4 bg-blue-100 rounded"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-300 rounded p-4 mb-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Communities
              </button>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 font-mono mb-1">
              /c/ - {community.name}
            </h2>
            <p className="text-blue-600 font-mono text-sm">{community.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-blue-600 font-mono">
              <span>{threads.length} threads</span>
              <span>{community.member_count} members</span>
              <span>Category: {community.category}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateThread(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </button>
        </div>
      </div>

      {showCreateThread && (
        <div className="bg-white border border-gray-300 rounded p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 font-mono mb-4">Create New Thread</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Thread Title"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name (optional)"
                value={newThread.author_name}
                onChange={(e) => setNewThread({ ...newThread, author_name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-mono text-gray-700">Select Flair:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {flairs.map((flair) => (
                  <button
                    key={flair.id}
                    onClick={() => setNewThread({ ...newThread, flair: flair.id })}
                    className={`px-3 py-1 text-xs font-mono border rounded transition-all ${
                      newThread.flair === flair.id
                        ? flair.color || 'bg-gray-200 text-gray-800 border-gray-300'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {flair.label}
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              placeholder="Thread Content"
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateThread(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-mono text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-mono text-sm"
              >
                Create Thread
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
        <h3 className="font-bold text-yellow-800 font-mono text-sm mb-1">Community Rules</h3>
        <ul className="text-xs text-yellow-700 font-mono">
          <li>• Stay on topic: {community.category}</li>
          <li>• Use appropriate flairs for your threads</li>
          <li>• Keep discussions constructive and professional</li>
          <li>• Search before creating duplicate threads</li>
        </ul>
      </div>
      
      {threads.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded p-8 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-mono">
            No threads yet in this community. Be the first to start a discussion!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div key={thread.id} className="bg-white border border-gray-300 rounded hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.flair && (
                        <span className={`px-2 py-1 text-xs font-mono border rounded ${getFlairStyle(thread.flair)}`}>
                          {getFlairLabel(thread.flair)}
                        </span>
                      )}
                      <h3 
                        className="text-lg font-bold text-blue-600 hover:text-blue-800 cursor-pointer font-mono"
                        onClick={() => setSelectedThread(thread)}
                      >
                        {thread.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                      <span>by {thread.author_name}</span>
                      <span>{formatTimeAgo(thread.created_at)}</span>
                      <span>No.{thread.post_number}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{thread.reply_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(thread.last_reply)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};