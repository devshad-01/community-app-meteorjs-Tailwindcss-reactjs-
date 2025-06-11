import React from 'react';
import { MessageSquare, MessageCircle, Search, TrendingUp, Clock, MessageCircleMore, Eye } from 'lucide-react';

export const ForumHeader = ({ 
  user, 
  onToggleChat, 
  showGeneralChat,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  return (
    <section className="bg-white dark:bg-slate-800 shadow-xl border-b border-warm-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col space-y-4 md:space-y-6">
          {/* Mobile: Title and Search in same row, Desktop: Title with description */}
          <div className="flex flex-col space-y-4">
            {/* Title row - Mobile: title + search, Desktop: title only */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center min-w-0">
                <MessageSquare className="mr-2 md:mr-4 h-6 w-6 md:h-10 md:w-10 text-warm-500 dark:text-orange-400 flex-shrink-0" />
                <h1 className="text-xl md:text-4xl font-bold text-warm-900 dark:text-white truncate">
                  <span className="hidden sm:inline">Community Forum</span>
                  <span className="sm:hidden">Forum</span>
                </h1>
              </div>
              
              {/* Mobile Search - Simple version (filter moved to separate component) */}
              <div className="md:hidden w-44">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200 bg-warm-50 shadow-inner placeholder-warm-400 dark:placeholder-slate-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-warm-400 dark:text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Description */}
            <p className="text-sm md:text-lg text-warm-600 dark:text-slate-400 hidden md:block">
              Connect, share, and discuss with fellow community members
            </p>
          </div>

          {/* Desktop row - Search, Sort Filters, and Chat */}
          <div className="hidden md:flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center justify-between">
            {/* Left side - Search and Sort Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-stretch sm:items-center">
              {/* Desktop Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border-0 border-warm-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all duration-200 bg-warm-50 shadow-inner placeholder-warm-400 dark:placeholder-slate-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-warm-400 dark:text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Sort Filters - Tab Style */}
              <div className="flex bg-warm-100 dark:bg-slate-700 rounded-xl p-1.5 shadow-inner overflow-x-auto">
                {[
                  { value: 'recent', label: 'Recent', icon: Clock },
                  { value: 'popular', label: 'Popular', icon: TrendingUp },
                  { value: 'replies', label: 'Replies', icon: MessageCircleMore },
                  { value: 'views', label: 'Views', icon: Eye }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => onSortChange(value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                      sortBy === value
                        ? 'bg-white dark:bg-slate-600 text-warm-700 dark:text-white shadow-lg scale-105'
                        : 'text-warm-600 dark:text-slate-300 hover:text-warm-700 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-600/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - General Chat Button - Only visible on desktop */}
            {user && (
              <div className="flex justify-end">
                <button 
                  onClick={onToggleChat}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                    showGeneralChat 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white' 
                      : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 dark:from-slate-600 dark:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-800 text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>General Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
