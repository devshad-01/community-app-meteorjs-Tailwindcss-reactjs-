import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { MessageCircle, Eye, Heart } from 'lucide-react';
import { PostImages } from './PostImages';
import { PostReplies } from './PostReplies';
import { InlineReplyBox } from './InlineReplyBox';
import { UserAvatar } from '../common/UserAvatar';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate author info
  const authorUser = Meteor.users.findOne(post.authorId);
  const authorName = authorUser?.profile?.name || authorUser?.username || 'Unknown User';
  const authorRole = getUserRole(post.authorId);
  const categoryData = getCategoryInfo(post.categoryId);
  
  // Content truncation logic
  const MOBILE_CHAR_LIMIT = 200;
  const shouldTruncate = post.content && post.content.length > MOBILE_CHAR_LIMIT;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.substring(0, MOBILE_CHAR_LIMIT).trim() + '...'
    : post.content;
  const baseClasses = isPinned 
    ? "bg-gradient-to-r from-warm-50 to-orange-50 dark:from-warm-900/20 dark:to-orange-900/20 border border-warm-200 dark:border-orange-800 rounded-xl p-3 sm:p-6 hover:shadow-warm transition-all duration-300 ease-in-out will-change-transform"
    : "bg-white dark:bg-slate-800 rounded-xl shadow-warm hover:shadow-warm-lg border border-warm-200 dark:border-slate-700 p-3 sm:p-6 transition-all duration-300 ease-in-out group will-change-transform";

  return (
    <div className={baseClasses}>
      {/* Header - Mobile-first responsive design */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <UserAvatar 
            user={authorUser}
            size="md"
            showTooltip={true}
            getRoleColor={getRoleColor}
            getUserRole={getUserRole}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg font-semibold text-warm-900 dark:text-white transition-colors duration-200 leading-tight break-words ${
              isPinned 
                ? 'hover:text-warm-600 dark:hover:text-orange-400'
                : 'group-hover:text-warm-600 dark:group-hover:text-orange-400'
            }`}>
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-warm-600 dark:text-slate-400 mt-1">
              <span className="truncate max-w-[120px] sm:max-w-none">{authorName}</span>
              <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs bg-${getRoleColor(authorRole)}-100 dark:bg-${getRoleColor(authorRole)}-900/20 text-${getRoleColor(authorRole)}-800 dark:text-${getRoleColor(authorRole)}-300 flex-shrink-0`}>
                {authorRole}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Category badge - responsive positioning */}
        <span className={`inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.categoryId)}-100 dark:bg-${getCategoryColor(post.categoryId)}-900/20 text-${getCategoryColor(post.categoryId)}-800 dark:text-${getCategoryColor(post.categoryId)}-300 self-start flex-shrink-0 whitespace-nowrap`}>
          <span className="mr-1">{categoryData.icon}</span>
          <span>{categoryData.name}</span>
        </span>
      </div>
      
      {/* Content */}
      <div className="mb-4">
        <p className="text-warm-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
          {displayContent}
        </p>
        {/* Read More/Less button for mobile */}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-warm-600 dark:text-orange-400 hover:text-warm-700 dark:hover:text-orange-300 text-sm font-medium transition-colors duration-200 sm:hidden"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {/* Images */}
      <PostImages images={post.images} />
      
      {/* Tags - responsive layout */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 sm:px-2 py-1 rounded-md text-xs font-medium bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300 hover:bg-warm-200 dark:hover:bg-slate-600 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Action buttons and stats - mobile-responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => toggleReply(post._id)}
            className="flex items-center space-x-1 text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xs:inline">{post.replyCount || 0} replies</span>
            <span className="xs:hidden">{post.replyCount || 0}</span>
          </button>
          <span className="flex items-center space-x-1 text-warm-400 dark:text-slate-500 flex-shrink-0">
            <Eye className="w-4 h-4" />
            <span className="hidden xs:inline">{post.views || 0} views</span>
            <span className="xs:hidden">{post.views || 0}</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikePost(post._id);
            }}
            className={`flex items-center space-x-1 transition-colors duration-200 cursor-pointer flex-shrink-0 ${
              (post.likes && post.likes.includes(user?._id))
                ? 'text-red-500 hover:text-red-600' 
                : 'text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${(post.likes && post.likes.includes(user?._id)) ? 'fill-current' : ''}`} />
            <span className="hidden xs:inline">{(post.likes || []).length} likes</span>
            <span className="xs:hidden">{(post.likes || []).length}</span>
          </button>
        </div>
        <div className="text-xs text-warm-400 dark:text-slate-500 self-start sm:self-auto">
          <span className="hidden sm:inline">Last reply </span>
          <span className="sm:hidden">Reply: </span>
          {formatTimeAgo(post.lastReplyAt)}
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
        <div className="mt-4 p-3 sm:p-4 bg-warm-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-warm-500 dark:border-orange-500 text-center">
          <p className="text-warm-600 dark:text-slate-400 text-sm">
            Please log in to reply to this post.
          </p>
        </div>
      )}
    </div>
  );
};
