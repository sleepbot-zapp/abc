import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Tag } from 'lucide-react';
import { Post, getCurrentUser, getUsers, toggleLike, addComment } from '../../lib/localStorage';

interface PostCardProps {
  post: Post;
  onPostUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentUser = getCurrentUser();
  const users = getUsers();
  
  const postUser = users.find(u => u.id === post.user_id);
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;

  const handleLike = async () => {
    if (loading || !currentUser) return;
    setLoading(true);

    try {
      toggleLike(post.id, currentUser.id);
      onPostUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      addComment(post.id, currentUser.id, newComment.trim());
      setNewComment('');
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      case 'improvement':
        return 'bg-green-100 text-green-800';
      case 'question':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'suggestion':
        return 'Suggestion';
      case 'improvement':
        return 'Improvement';
      case 'question':
        return 'Question';
      default:
        return 'Post';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {postUser?.full_name || 'Anonymous User'}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500">{postUser?.profession || 'Architect'}</p>
                <span className="text-slate-300">•</span>
                <p className="text-sm text-slate-500">{formatTimeAgo(post.created_at)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </span>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p className="text-slate-800 mb-4 leading-relaxed">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={loading || !currentUser}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
              } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likes.length}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{post.comments.length}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {currentUser && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {post.comments.map((comment) => {
                const commentUser = users.find(u => u.id === comment.user_id);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-slate-900">
                            {commentUser?.full_name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};