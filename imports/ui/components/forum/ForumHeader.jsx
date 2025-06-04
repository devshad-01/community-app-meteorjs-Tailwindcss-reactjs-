import React from 'react';
import { MessageSquare, Plus, MessageCircle } from 'lucide-react';

export const ForumHeader = ({ user, onNewPost, onToggleChat, isChatOpen }) => {
  return (
    <section className="bg-white dark:bg-slate-800 shadow-lg border-b border-warm-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-warm-900 dark:text-white mb-2 flex items-center">
              <MessageSquare className="mr-3 h-8 w-8 text-warm-500 dark:text-orange-400" />
              Community Forum
            </h1>
            <p className="text-warm-600 dark:text-slate-400">
              Connect, share, and discuss with fellow community members
            </p>
          </div>
          {user && (
            <div className="flex space-x-3">
              <button 
                onClick={onToggleChat}
                className={`${
                  isChatOpen 
                    ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' 
                    : 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700'
                } text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 will-change-transform`}
              >
                <MessageCircle className="w-4 h-4 mr-2 inline" />
                {isChatOpen ? 'Close Chat' : 'General Chat'}
              </button>
              
              <button 
                onClick={onNewPost}
                className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 will-change-transform"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                New Post
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
