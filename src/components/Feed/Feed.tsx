import React, { useState, useEffect } from 'react';
import { getPosts, Post } from '../../lib/localStorage';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

interface FeedProps {
  category: 'feed' | 'suggestion' | 'improvement' | 'question';
}

export const Feed: React.FC<FeedProps> = ({ category }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    try {
      const allPosts = getPosts();
      const filteredPosts = category === 'feed' 
        ? allPosts 
        : allPosts.filter(post => post.category === category);
      
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

  const getCategoryTitle = () => {
    switch (category) {
      case 'suggestion':
        return 'Architectural Suggestions';
      case 'improvement':
        return 'Design Improvements';
      case 'question':
        return 'Questions & Discussions';
      default:
        return 'Community Feed';
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'suggestion':
        return 'Share innovative ideas and suggestions for architectural projects';
      case 'improvement':
        return 'Propose enhancements to existing designs and methodologies';
      case 'question':
        return 'Ask questions and engage in architectural discussions';
      default:
        return 'Latest posts from the architectural community';
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200 animate-pulse">
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-slate-200 animate-pulse">
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{getCategoryTitle()}</h2>
        <p className="text-slate-600">{getCategoryDescription()}</p>
      </div>

      <CreatePost onPostCreated={fetchPosts} category={category} />
      
      {posts.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
          <p className="text-slate-500">
            {category === 'feed' 
              ? 'No posts yet. Be the first to share something!' 
              : `No ${category}s yet. Be the first to contribute!`
            }
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