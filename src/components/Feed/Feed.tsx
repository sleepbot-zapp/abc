import React, { useState, useEffect } from 'react';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

interface FeedProps {
  category: 'general' | 'suggestions' | 'improvements' | 'questions';
}

export const Feed: React.FC<FeedProps> = ({ category }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    try {
      const allPosts = JSON.parse(localStorage.getItem('anon_posts') || '[]');
      const filteredPosts = category === 'general' 
        ? allPosts 
        : allPosts.filter((post: any) => post.category === category);
      
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const getBoardInfo = () => {
    switch (category) {
      case 'suggestions':
        return { 
          name: '/s/ - Suggestions', 
          desc: 'Share innovative architectural ideas and suggestions',
          rules: ['Be constructive', 'No spam', 'Stay on topic']
        };
      case 'improvements':
        return { 
          name: '/i/ - Improvements', 
          desc: 'Propose enhancements to existing designs and methodologies',
          rules: ['Provide context', 'Be specific', 'Include examples when possible']
        };
      case 'questions':
        return { 
          name: '/q/ - Questions', 
          desc: 'Ask questions about architecture, design, and construction',
          rules: ['Search before posting', 'Be specific', 'Include relevant details']
        };
      default:
        return { 
          name: '/g/ - General', 
          desc: 'General architecture discussion and random topics',
          rules: ['Keep it civil', 'No off-topic posts', 'Respect others']
        };
    }
  };

  const boardInfo = getBoardInfo();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 animate-pulse">
          <div className="h-20 bg-blue-100 rounded"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-300 rounded p-4 animate-pulse">
            <div className="h-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CreatePost onPostCreated={fetchPosts} category={category} />
      
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
        <h3 className="font-bold text-yellow-800 font-mono text-sm mb-1">Board Rules</h3>
        <ul className="text-xs text-yellow-700 font-mono">
          {boardInfo.rules.map((rule, index) => (
            <li key={index}>• {rule}</li>
          ))}
        </ul>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded p-8 text-center">
          <p className="text-gray-500 font-mono">
            No threads yet. Be the first to post!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdate={fetchPosts}
          />
        ))
      )}
    </div>
  );
};