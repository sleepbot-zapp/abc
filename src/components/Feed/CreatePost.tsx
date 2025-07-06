import React, { useState } from 'react';
import { Send, Image, Tag } from 'lucide-react';

interface CreatePostProps {
  onPostCreated: () => void;
  category: 'general';
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, category }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [selectedFlair, setSelectedFlair] = useState('');
  const [loading, setLoading] = useState(false);

  const flairs = [
    { id: '', label: 'No Flair', color: '' },
    { id: 'suggestion', label: 'Suggestion', color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700' },
    { id: 'improvement', label: 'Improvement', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' },
    { id: 'query', label: 'Query', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700' },
    { id: 'discussion', label: 'Discussion', color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700' },
    { id: 'showcase', label: 'Showcase', color: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700' },
    { id: 'help', label: 'Help', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' },
    { id: 'news', label: 'News', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700' }
  ];

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const newPost = {
        id: crypto.randomUUID(),
        content: content.trim(),
        author_name: name.trim() || 'Anonymous',
        category,
        flair: selectedFlair,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes: [],
        comments: [],
        post_number: Math.floor(Math.random() * 999999999) + 100000000
      };

      const posts = JSON.parse(localStorage.getItem('anon_posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('anon_posts', JSON.stringify(posts));

      setContent('');
      setName('');
      setSelectedFlair('');
      setShowCreatePost(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-4 mb-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-blue-800 dark:text-blue-200 font-mono">/g/ - General</h2>
        <p className="text-sm text-blue-600 dark:text-blue-400">General architecture discussion</p>
      </div>

      {!showCreatePost ? (
        <button
          onClick={() => setShowCreatePost(true)}
          className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-left text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-mono"
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Subject (optional)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">Select Flair:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {flairs.map((flair) => (
                <button
                  key={flair.id}
                  onClick={() => setSelectedFlair(flair.id)}
                  className={`px-3 py-1 text-xs font-mono border rounded transition-all ${
                    selectedFlair === flair.id
                      ? flair.color || 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {flair.label}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comment"
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300">
                <Image className="w-4 h-4" />
                Choose File
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">No file chosen</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-mono text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={loading || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
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