import React from 'react';
import { MessageSquare, MessageCircle, Search, TrendingUp, Clock, MessageCircleMore, Eye } from 'lucide-react';

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
          {/* Top row - Title only */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-warm-900 dark:text-white mb-2 flex items-center">
                <MessageSquare className="mr-3 h-8 w-8 text-warm-500 dark:text-orange-400" />
                Community Forum
              </h1>
              <p className="text-warm-600 dark:text-slate-400">
                Connect, share, and discuss with fellow community members
              </p>
            </div>
          </div>

          {/* Bottom row - Search, Sort Filters, and Chat */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center justify-between">
            {/* Left side - Search and Sort Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-warm-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200 bg-warm-50"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-warm-400 dark:text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Sort Filters - Tab Style */}
              <div className="flex bg-warm-100 dark:bg-slate-700 rounded-xl p-1">
                {[
                  { value: 'recent', label: 'Recent', icon: Clock },
                  { value: 'popular', label: 'Popular', icon: TrendingUp },
                  { value: 'replies', label: 'Replies', icon: MessageCircleMore },
                  { value: 'views', label: 'Views', icon: Eye }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => onSortChange(value)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      sortBy === value
                        ? 'bg-white dark:bg-slate-600 text-warm-700 dark:text-white shadow-sm'
                        : 'text-warm-600 dark:text-slate-300 hover:text-warm-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - General Chat Button */}
            {user && (
              <div className="flex justify-end">
                <button 
                  onClick={onToggleChat}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isChatOpen 
                      ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm' 
                      : 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 text-white shadow-sm'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">{isChatOpen ? 'Close Chat' : 'General Chat'}</span>
                  <span className="sm:hidden">Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
