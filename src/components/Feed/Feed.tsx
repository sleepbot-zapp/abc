import React, { useState, useEffect } from 'react';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';

interface FeedProps {
  category: 'general';
}

export const Feed: React.FC<FeedProps> = ({ category }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    try {
      const allPosts = JSON.parse(localStorage.getItem('anon_posts') || '[]');
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-4 animate-pulse">
          <div className="h-20 bg-blue-100 dark:bg-blue-900 rounded"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-4 animate-pulse">
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CreatePost onPostCreated={fetchPosts} category={category} />
      
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded p-3 mb-4">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-200 font-mono text-sm mb-1">Board Rules</h3>
        <ul className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">
          <li>• Keep it civil</li>
          <li>• No off-topic posts</li>
          <li>• Respect others</li>
          <li>• No spam or duplicate threads</li>
        </ul>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-mono">
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