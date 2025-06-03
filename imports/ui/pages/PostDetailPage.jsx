import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Eye, 
  Share2, 
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  Pin
} from 'lucide-react';
import { 
  ForumCategories, 
  ForumPosts, 
  ForumReplies,
  ForumPublications, 
  ForumMethods 
} from '../../api/forums';

export const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  const { user, post, replies, category, loading } = useTracker(() => {
    // Subscribe to the specific post and its replies
    const postHandle = Meteor.subscribe(ForumPublications.singlePost, postId);
    const repliesHandle = Meteor.subscribe(ForumPublications.repliesByPost, postId);
    const categoriesHandle = Meteor.subscribe(ForumPublications.categories);

    const loading = !postHandle.ready() || !repliesHandle.ready() || !categoriesHandle.ready();

    if (loading) {
      return { user: Meteor.user(), post: null, replies: [], category: null, loading: true };
    }

    const post = ForumPosts.findOne(postId);
    const category = post ? ForumCategories.findOne(post.categoryId) : null;
    const replies = ForumReplies.find(
      { postId }, 
      { sort: { createdAt: 1 } }
    ).fetch();

    return {
      user: Meteor.user(),
      post,
      replies,
      category,
      loading: false
    };
  }, [postId]);

  const handleLikePost = async () => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      await Meteor.callAsync(ForumMethods.votePost, postId, 'like');
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to reply');
      return;
    }

    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    setSubmittingReply(true);
    try {
      await Meteor.callAsync(ForumMethods.createReply, {
        postId,
        content: replyContent
        // omit parentReplyId for top-level replies since it's optional
      });
      
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to create reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getUserRole = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user?.profile?.role || 'Member';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Pastor': 'warm',
      'Volunteer Coordinator': 'orange',
      'Small Group Leader': 'blue',
      'Member': 'slate'
    };
    return colors[role] || 'slate';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-pulse text-warm-600 dark:text-slate-400">
          Loading post...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-white mb-4">
            Post Not Found
          </h2>
          <button
            onClick={() => navigate('/forum')}
            className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  const author = Meteor.users.findOne(post.authorId);
  const authorName = author?.profile?.name || author?.username || 'Unknown User';
  const authorRole = getUserRole(post.authorId);
  const isLiked = post.likes?.includes(user?._id);
  const canEdit = user && (user._id === post.authorId || user.profile?.role === 'admin' || user.profile?.role === 'moderator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-800 shadow-lg border-b border-warm-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/forum')}
            className="flex items-center text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </button>
          
          {category && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-lg font-semibold text-warm-700 dark:text-orange-300">
                {category.name}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Post */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 mb-8">
          {/* Post Header */}
          <div className="p-6 border-b border-warm-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-warm-500 to-warm-600 dark:from-orange-500 dark:to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-warm-900 dark:text-white">
                    {authorName}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-warm-600 dark:text-slate-400">
                    <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(authorRole)}-100 dark:bg-${getRoleColor(authorRole)}-900/20 text-${getRoleColor(authorRole)}-800 dark:text-${getRoleColor(authorRole)}-300`}>
                      {authorRole}
                    </span>
                    <span>•</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {canEdit && (
                <div className="relative">
                  <button className="p-2 text-warm-400 hover:text-warm-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-warm-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {post.pinned && (
              <div className="flex items-center text-warm-600 dark:text-orange-400 text-sm mb-4">
                <Pin className="w-4 h-4 mr-1" />
                Pinned Post
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="prose prose-warm dark:prose-invert max-w-none mb-6">
              <p className="text-warm-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-warm-200 dark:border-slate-700">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLikePost}
                  className={`flex items-center space-x-2 transition-colors duration-200 ${
                    isLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-warm-500 hover:text-warm-600 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{(post.likes || []).length}</span>
                </button>

                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center space-x-2 text-warm-500 hover:text-warm-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.replyCount || 0} replies</span>
                </button>

                <div className="flex items-center space-x-2 text-warm-400 dark:text-slate-500">
                  <Eye className="w-5 h-5" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>

              <button className="flex items-center space-x-2 text-warm-400 hover:text-warm-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors duration-200">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && user && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4">
              Write a Reply
            </h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply || !replyContent.trim()}
                  className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-warm-900 dark:text-white mb-6">
              Replies ({replies.length})
            </h3>
            
            {replies.map(reply => {
              const replyAuthor = Meteor.users.findOne(reply.authorId);
              const replyAuthorName = replyAuthor?.profile?.name || replyAuthor?.username || 'Unknown User';
              const replyAuthorRole = getUserRole(reply.authorId);
              
              return (
                <div
                  key={reply._id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-warm-400 to-warm-500 dark:from-orange-400 dark:to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {replyAuthorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-warm-900 dark:text-white">
                          {replyAuthorName}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(replyAuthorRole)}-100 dark:bg-${getRoleColor(replyAuthorRole)}-900/20 text-${getRoleColor(replyAuthorRole)}-800 dark:text-${getRoleColor(replyAuthorRole)}-300`}>
                          {replyAuthorRole}
                        </span>
                        <span className="text-sm text-warm-500 dark:text-slate-400">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-warm-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No replies state */}
        {replies.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-warm-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-warm-900 dark:text-white mb-2">
              No replies yet
            </h3>
            <p className="text-warm-600 dark:text-slate-400 mb-4">
              Be the first to share your thoughts on this post
            </p>
            {user && !showReplyForm && (
              <button
                onClick={() => setShowReplyForm(true)}
                className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Write a Reply
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
