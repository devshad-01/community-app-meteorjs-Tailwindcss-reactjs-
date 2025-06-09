import React from 'react';
import { Meteor } from 'meteor/meteor';
import { MessageCircle, Eye, Heart } from 'lucide-react';
import { PostImages } from './PostImages';
import { PostReplies } from './PostReplies';
import { InlineReplyBox } from './InlineReplyBox';

export const ForumPost = ({ 
  post,
  user,
  isPinned = false,
  getCategoryInfo,
  getCategoryColor,
  getRoleColor,
  formatTimeAgo,
  getUserRole,
  handleLikePost,
  handleLikeReply,
  toggleReply,
  replyToggles,
  replyContents,
  submittingReplies,
  handleReplyContentChange,
  handleSubmitReply,
  allReplies,
  showMoreReplies,
  toggleShowMoreReplies
}) => {
  // Calculate author info
  const authorUser = Meteor.users.findOne(post.authorId);
  const authorName = authorUser?.profile?.name || authorUser?.username || 'Unknown User';
  const authorRole = getUserRole(post.authorId);
  const categoryData = getCategoryInfo(post.categoryId);
  const baseClasses = isPinned 
    ? "bg-gradient-to-r from-warm-50 to-orange-50 dark:from-warm-900/20 dark:to-orange-900/20 border border-warm-200 dark:border-orange-800 rounded-xl p-6 hover:shadow-warm transition-all duration-300 ease-in-out will-change-transform"
    : "bg-white dark:bg-slate-800 rounded-xl shadow-warm hover:shadow-warm-lg border border-warm-200 dark:border-slate-700 p-6 transition-all duration-300 ease-in-out group will-change-transform";

  return (
    <div className={baseClasses}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${isPinned 
            ? 'from-warm-500 to-warm-600 dark:from-orange-500 dark:to-orange-600'
            : `from-${getCategoryColor(post.categoryId)}-500 to-${getCategoryColor(post.categoryId)}-600`
          } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
            {authorName.charAt(0)}
          </div>
          <div>
            <h3 className={`text-lg font-semibold text-warm-900 dark:text-white transition-colors duration-200 ${
              isPinned 
                ? 'hover:text-warm-600 dark:hover:text-orange-400'
                : 'group-hover:text-warm-600 dark:group-hover:text-orange-400'
            }`}>
              {post.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-warm-600 dark:text-slate-400">
              <span>{authorName}</span>
              <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(authorRole)}-100 dark:bg-${getRoleColor(authorRole)}-900/20 text-${getRoleColor(authorRole)}-800 dark:text-${getRoleColor(authorRole)}-300`}>
                {authorRole}
              </span>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.categoryId)}-100 dark:bg-${getCategoryColor(post.categoryId)}-900/20 text-${getCategoryColor(post.categoryId)}-800 dark:text-${getCategoryColor(post.categoryId)}-300`}>
          {categoryData.icon} {categoryData.name}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-warm-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
      
      {/* Images */}
      <PostImages images={post.images} />
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm">
          <button
            onClick={() => toggleReply(post._id)}
            className="flex items-center space-x-1 text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.replyCount || 0} replies</span>
          </button>
          <span className="flex items-center space-x-1 text-warm-400 dark:text-slate-500">
            <Eye className="w-4 h-4" />
            <span>{post.views || 0} views</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikePost(post._id);
            }}
            className={`flex items-center space-x-1 transition-colors duration-200 ${
              (post.likes && post.likes.includes(user?._id))
                ? 'text-red-500 hover:text-red-600' 
                : 'text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${(post.likes && post.likes.includes(user?._id)) ? 'fill-current' : ''}`} />
            <span>{(post.likes || []).length} likes</span>
          </button>
        </div>
        <div className="text-xs text-warm-400 dark:text-slate-500">
          Last reply {formatTimeAgo(post.lastReplyAt)}
        </div>
      </div>

      {/* Replies Display */}
      <PostReplies 
        postId={post._id}
        allReplies={allReplies}
        showMoreReplies={showMoreReplies}
        toggleShowMoreReplies={toggleShowMoreReplies}
        formatTimeAgo={formatTimeAgo}
        getUserRole={getUserRole}
        getRoleColor={getRoleColor}
        user={user}
        handleLikeReply={handleLikeReply}
      />

      {/* Inline Reply Box */}
      {user && replyToggles[post._id] && (
        <InlineReplyBox 
          postId={post._id}
          user={user}
          replyContents={replyContents}
          submittingReplies={submittingReplies}
          handleReplyContentChange={handleReplyContentChange}
          handleSubmitReply={handleSubmitReply}
          toggleReply={toggleReply}
        />
      )}

      {!user && replyToggles[post._id] && (
        <div className="mt-4 p-4 bg-warm-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-warm-500 dark:border-orange-500 text-center">
          <p className="text-warm-600 dark:text-slate-400">
            Please log in to reply to this post.
          </p>
        </div>
      )}
    </div>
  );
};
