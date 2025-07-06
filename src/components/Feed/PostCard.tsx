import React, { useState } from 'react';
import { MessageCircle, MoreHorizontal, Quote, Tag } from 'lucide-react';

interface PostCardProps {
  post: any;
  onPostUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');

  const getFlairStyle = (flair: string) => {
    switch (flair) {
      case 'suggestion':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'improvement':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'query':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
      case 'discussion':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700';
      case 'showcase':
        return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700';
      case 'help':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      case 'news':
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700';
      default:
        return '';
    }
  };

  const getFlairLabel = (flair: string) => {
    switch (flair) {
      case 'suggestion':
        return 'Suggestion';
      case 'improvement':
        return 'Improvement';
      case 'query':
        return 'Query';
      case 'discussion':
        return 'Discussion';
      case 'showcase':
        return 'Showcase';
      case 'help':
        return 'Help';
      case 'news':
        return 'News';
      default:
        return '';
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: crypto.randomUUID(),
        content: newComment.trim(),
        author_name: commentName.trim() || 'Anonymous',
        created_at: new Date().toISOString(),
        post_number: Math.floor(Math.random() * 999999999) + 100000000
      };

      const posts = JSON.parse(localStorage.getItem('anon_posts') || '[]');
      const postIndex = posts.findIndex((p: any) => p.id === post.id);
      if (postIndex >= 0) {
        if (!posts[postIndex].comments) posts[postIndex].comments = [];
        posts[postIndex].comments.push(comment);
        localStorage.setItem('anon_posts', JSON.stringify(posts));
      }

      setNewComment('');
      setCommentName('');
      onPostUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mb-4">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-green-700 dark:text-green-400 font-mono">
              {post.author_name || 'Anonymous'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {formatTimeAgo(post.created_at)}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-mono">
              No.{post.post_number || Math.floor(Math.random() * 999999999)}
            </span>
            {post.flair && (
              <span className={`px-2 py-1 text-xs font-mono border rounded ${getFlairStyle(post.flair)}`}>
                {getFlairLabel(post.flair)}
              </span>
            )}
          </div>
          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-gray-800 dark:text-gray-200 mb-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
        
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post attachment"
            className="max-w-full h-auto rounded border border-gray-300 dark:border-gray-600 mb-4 cursor-pointer hover:opacity-90 transition-opacity"
          />
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-mono"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reply ({post.comments?.length || 0})</span>
          </button>
          <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-mono">
            <Quote className="w-4 h-4" />
            <span>Quote</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="space-y-3 mb-4">
              {(post.comments || []).map((comment: any) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-green-700 dark:text-green-400 font-mono text-sm">
                      {comment.author_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                      No.{comment.post_number || Math.floor(Math.random() * 999999999)}
                    </span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  placeholder="Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};