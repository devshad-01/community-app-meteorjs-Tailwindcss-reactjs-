import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Heart } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const PostReplies = ({ 
  postId, 
  allReplies, 
  showMoreReplies, 
  toggleShowMoreReplies,
  formatTimeAgo,
  getUserRole,
  getRoleColor,
  user,
  handleLikeReply
}) => {
  const replies = allReplies ? allReplies.filter(reply => reply.postId === postId) : [];
  
  if (!replies || replies.length === 0) return null;

  const INITIAL_REPLIES_LIMIT = 3;
  const showingAll = showMoreReplies[postId];
  const visibleReplies = showingAll ? replies : replies.slice(0, INITIAL_REPLIES_LIMIT);
  const hasMoreReplies = replies.length > INITIAL_REPLIES_LIMIT;

  return (
    <div className="mt-4 space-y-3">
      {/* Replies Display */}
      {visibleReplies.map(reply => (
        <ReplyItem 
          key={reply._id}
          reply={reply}
          formatTimeAgo={formatTimeAgo}
          getUserRole={getUserRole}
          getRoleColor={getRoleColor}
          user={user}
          handleLikeReply={handleLikeReply}
        />
      ))}

      {/* Show More Replies Button */}
      {hasMoreReplies && (
        <button
          onClick={() => toggleShowMoreReplies(postId)}
          className="w-full text-left text-sm text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 transition-colors duration-200 py-2 cursor-pointer"
        >
          {showingAll 
            ? `Show fewer replies` 
            : `Show ${replies.length - INITIAL_REPLIES_LIMIT} more replies`
          }
        </button>
      )}
    </div>
  );
};

// Individual Reply Component with Read More functionality
const ReplyItem = ({ 
  reply, 
  formatTimeAgo, 
  getUserRole, 
  getRoleColor, 
  user, 
  handleLikeReply 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const replyAuthor = Meteor.users.findOne(reply.authorId);
  const replyAuthorName = replyAuthor?.profile?.name || replyAuthor?.username || 'Unknown User';
  const replyAuthorRole = getUserRole(reply.authorId);
  
  // Content truncation logic for replies
  const MOBILE_CHAR_LIMIT = 150;
  const shouldTruncate = reply.content && reply.content.length > MOBILE_CHAR_LIMIT;
  const displayContent = shouldTruncate && !isExpanded 
    ? reply.content.substring(0, MOBILE_CHAR_LIMIT).trim() + '...'
    : reply.content;

  return (
    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-warm-25 dark:bg-slate-700/30 rounded-lg border border-warm-100 dark:border-slate-600">
      <UserAvatar 
        user={replyAuthor}
        size="sm"
        showTooltip={true}
        getRoleColor={getRoleColor}
        getUserRole={getUserRole}
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
          <span className="font-medium text-sm text-warm-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
            {replyAuthorName}
          </span>
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs bg-${getRoleColor(replyAuthorRole)}-100 dark:bg-${getRoleColor(replyAuthorRole)}-900/20 text-${getRoleColor(replyAuthorRole)}-700 dark:text-${getRoleColor(replyAuthorRole)}-300 flex-shrink-0`}>
            {replyAuthorRole}
          </span>
          <span className="text-xs text-warm-500 dark:text-slate-400 flex-shrink-0">
            {formatTimeAgo(reply.createdAt)}
          </span>
        </div>
        <p className="text-sm text-warm-700 dark:text-slate-300 whitespace-pre-wrap break-words">
          {displayContent}
        </p>
        {/* Read More/Less button for mobile replies */}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-warm-600 dark:text-orange-400 hover:text-warm-700 dark:hover:text-orange-300 text-xs font-medium transition-colors duration-200 sm:hidden"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <div className="flex items-center space-x-3 sm:space-x-4 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (handleLikeReply) {
                handleLikeReply(reply._id);
              }
            }}
            className={`flex items-center space-x-1 text-xs transition-colors duration-200 cursor-pointer ${
              (reply.likes && reply.likes.includes(user?._id))
                ? 'text-red-500 hover:text-red-600' 
                : 'text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300'
            }`}
          >
            <Heart className={`w-3 h-3 ${(reply.likes && reply.likes.includes(user?._id)) ? 'fill-current' : ''}`} />
            <span>{(reply.likes || []).length}</span>
          </button>
          <button className="text-xs text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};
