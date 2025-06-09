import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Heart } from 'lucide-react';

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
      {visibleReplies.map(reply => {
        const replyAuthor = Meteor.users.findOne(reply.authorId);
        const replyAuthorName = replyAuthor?.profile?.name || replyAuthor?.username || 'Unknown User';
        const replyAuthorRole = getUserRole(reply.authorId);
        
        return (
          <div key={reply._id} className="flex items-start space-x-3 p-3 bg-warm-25 dark:bg-slate-700/30 rounded-lg border border-warm-100 dark:border-slate-600">
            <div className="w-8 h-8 bg-gradient-to-br from-warm-400 to-warm-500 dark:from-orange-400 dark:to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {replyAuthorName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm text-warm-900 dark:text-white">
                  {replyAuthorName}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs bg-${getRoleColor(replyAuthorRole)}-100 dark:bg-${getRoleColor(replyAuthorRole)}-900/20 text-${getRoleColor(replyAuthorRole)}-700 dark:text-${getRoleColor(replyAuthorRole)}-300`}>
                  {replyAuthorRole}
                </span>
                <span className="text-xs text-warm-500 dark:text-slate-400">
                  {formatTimeAgo(reply.createdAt)}
                </span>
              </div>
              <p className="text-sm text-warm-700 dark:text-slate-300 whitespace-pre-wrap">
                {reply.content}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (handleLikeReply) {
                      handleLikeReply(reply._id);
                    }
                  }}
                  className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                    (reply.likes && reply.likes.includes(user?._id))
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${(reply.likes && reply.likes.includes(user?._id)) ? 'fill-current' : ''}`} />
                  <span>{(reply.likes || []).length}</span>
                </button>
                <button className="text-xs text-warm-500 dark:text-slate-400 hover:text-warm-600 dark:hover:text-slate-300 transition-colors duration-200">
                  Reply
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Show More Replies Button */}
      {hasMoreReplies && (
        <button
          onClick={() => toggleShowMoreReplies(postId)}
          className="w-full text-left text-sm text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 transition-colors duration-200 py-2"
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
