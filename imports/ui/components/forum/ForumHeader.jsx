import React from 'react';
import { MessageSquare, MessageCircle, Search } from 'lucide-react';

export const ForumHeader = ({ 
  user, 
  onToggleChat, 
  isChatOpen,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 shadow-lg border-b border-warm-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Top row - Title and Chat button */}
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
                  } text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 will-change-transform cursor-pointer`}
                >
                  <MessageCircle className="w-4 h-4 mr-2 inline" />
                  {isChatOpen ? 'Close Chat' : 'General Chat'}
                </button>
              </div>
            )}
          </div>

          {/* Bottom row - Search and Sort */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-warm-400 dark:text-slate-400" />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="sm:w-40">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200"
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
                <option value="replies">Most Replies</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
