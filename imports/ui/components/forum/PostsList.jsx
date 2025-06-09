import React from 'react';
import { Meteor } from 'meteor/meteor';
import { MessageSquare, Pin } from 'lucide-react';
import { ForumPost } from './ForumPost';

export const PostsList = ({ 
  posts,
  user,
  isPinned = false,
  title,
  categoryInfo,
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
  toggleShowMoreReplies,
  onNewPost
}) => {
  if (posts.length === 0 && !isPinned) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-warm-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-warm-900 dark:text-white mb-2">
          No posts found
        </h3>
        <p className="text-warm-600 dark:text-slate-400 mb-4">
          Try adjusting your search or filter criteria
        </p>
        {user && (
          <button 
            onClick={onNewPost}
            className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 will-change-transform"
          >
            Start a new discussion
          </button>
        )}
      </div>
    );
  }

  if (posts.length === 0) return null;

  const titleIcon = isPinned ? <Pin className="w-5 h-5 mr-2 text-warm-500 dark:text-orange-400" /> : null;

  return (
    <div className={isPinned ? "mb-6" : "space-y-4"}>
      {title && (
        <h2 className="text-xl font-semibold text-warm-900 dark:text-white mb-4 flex items-center">
          {titleIcon}
          {title}
        </h2>
      )}
      
      <div className="space-y-4">
        {posts.map(post => (
          <ForumPost
            key={post._id}
            post={post}
            user={user}
            isPinned={isPinned}
            getCategoryInfo={categoryInfo}
            getCategoryColor={getCategoryColor}
            getRoleColor={getRoleColor}
            formatTimeAgo={formatTimeAgo}
            getUserRole={getUserRole}
            handleLikePost={handleLikePost}
            handleLikeReply={handleLikeReply}
            toggleReply={toggleReply}
            replyToggles={replyToggles}
            replyContents={replyContents}
            submittingReplies={submittingReplies}
            handleReplyContentChange={handleReplyContentChange}
            handleSubmitReply={handleSubmitReply}
            allReplies={allReplies}
            showMoreReplies={showMoreReplies}
            toggleShowMoreReplies={toggleShowMoreReplies}
          />
        ))}
      </div>
    </div>
  );
};
