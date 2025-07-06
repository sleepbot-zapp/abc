import React, { useState } from 'react';
import { Send, Image } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: () => void;
  category: 'general';
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, category }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      // Simulate post creation with anonymous data
      const newPost = {
        id: crypto.randomUUID(),
        content: content.trim(),
        author_name: name.trim() || 'Anonymous',
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes: [],
        comments: [],
        post_number: Math.floor(Math.random() * 999999999) + 100000000
      };

      // Store in localStorage for demo
      const posts = JSON.parse(localStorage.getItem('anon_posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('anon_posts', JSON.stringify(posts));

      setContent('');
      setName('');
      setShowCreatePost(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-blue-800 font-mono">/g/ - General</h2>
        <p className="text-sm text-blue-600">General architecture discussion</p>
      </div>

      {!showCreatePost ? (
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full p-3 bg-white border border-gray-300 rounded text-left text-gray-500 hover:bg-gray-50 transition-colors font-mono"
        >
          Start a new thread...
        </button>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Subject (optional)"
              className="px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comment"
            className="w-full h-32 p-3 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 transition-colors">
                <Image className="w-4 h-4" />
                Choose File
              </button>
              <span className="text-xs text-gray-500 self-center">No file chosen</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-mono text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={loading || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};