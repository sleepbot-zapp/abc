import React, { useState } from 'react';
import { Plus, Image, Send, User, LogIn, Building2 } from 'lucide-react';
import { getCurrentUser, createUser, signIn, createPost } from '../../lib/localStorage';

interface CreatePostProps {
  onPostCreated: () => void;
  category: 'feed' | 'suggestion' | 'improvement' | 'question';
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, category }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;

    setAuthLoading(true);
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          alert('Please enter your full name');
          return;
        }

        const newUser = createUser({
          username: email.split('@')[0] || 'user',
          full_name: fullName.trim(),
          email: email.trim(),
          profession: profession.trim() || 'Architect'
        });

        setUser(newUser);
      } else {
        const signedInUser = signIn(email.trim(), password.trim());
        if (!signedInUser) {
          alert('Invalid email or password');
          return;
        }
        setUser(signedInUser);
      }

      setEmail('');
      setPassword('');
      setFullName('');
      setProfession('');
      setShowAuth(false);
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      createPost({
        user_id: user.id,
        content: content.trim(),
        category,
        tags: tagArray
      });

      setContent('');
      setTags('');
      setShowCreatePost(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryPlaceholder = () => {
    switch (category) {
      case 'suggestion':
        return 'Share your architectural suggestions and ideas...';
      case 'improvement':
        return 'Propose improvements to existing designs or processes...';
      case 'question':
        return 'Ask questions about architecture, design, or construction...';
      default:
        return 'Share your thoughts with the community...';
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'suggestion':
        return 'Share a Suggestion';
      case 'improvement':
        return 'Propose an Improvement';
      case 'question':
        return 'Ask a Question';
      default:
        return 'Create a Post';
    }
  };

  if (!user) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Join Architect's Society</h3>
          <p className="text-slate-600 mb-4">Connect with fellow architects and share your expertise.</p>
          
          {!showAuth ? (
            <button
              onClick={() => setShowAuth(true)}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              Get Started
            </button>
          ) : (
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    !isSignUp 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    isSignUp 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
              
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              
              {isSignUp && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Profession (e.g., Architect, Urban Planner)"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAuth(false)}
                  className="flex-1 py-2 px-4 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAuth}
                  disabled={authLoading || !email.trim() || !password.trim() || (isSignUp && !fullName.trim())}
                  className="flex-1 py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-slate-600" />
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="flex-1 text-left px-4 py-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {getCategoryPlaceholder()}
        </button>
      </div>
      
      {showCreatePost && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">{getCategoryTitle()}</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getCategoryPlaceholder()}
            className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated, e.g., sustainable, modern, residential)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
              <Image className="w-4 h-4" />
              Add Image
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={loading || !content.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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