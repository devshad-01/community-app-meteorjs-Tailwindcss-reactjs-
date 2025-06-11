import React, { useState } from 'react';
import { MessageSquare, MessageCircle, Search, TrendingUp, Clock, MessageCircleMore, Eye, ChevronLeft, ChevronDown } from 'lucide-react';

export const ForumHeader = ({ 
  user, 
  onToggleChat, 
  showGeneralChat,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  // Mobile filter props
  categories = [],
  selectedCategory,
  onCategoryChange,
  categoriesLoading = false
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(true);
  };

  const handleBackToFilter = () => {
    setShowMobileSearch(false);
  };
  return (
    <section className="bg-gradient-to-r from-white via-warm-25 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 shadow-xl border-b border-warm-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-2 sm:py-6 md:py-8">
        <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-6">
          {/* Mobile: Enhanced Title and Mobile Filter/Search */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {/* Mobile Title Row with improved spacing */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-warm-500 to-orange-500 dark:from-orange-500 dark:to-red-500 shadow-lg mr-3 md:mr-4 flex-shrink-0">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl md:text-4xl font-bold bg-gradient-to-r from-warm-900 to-orange-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent truncate">
                  <span className="hidden sm:inline">Community Forum</span>
                  <span className="sm:hidden">Forum</span>
                </h1>
              </div>
            </div>

            {/* Mobile Filter/Search - Seamlessly Integrated */}
            <div className="md:hidden">
              {!showMobileSearch ? (
                /* Filter View - Clean Integration */
                <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-2 border border-warm-200/50 dark:border-slate-600/50">
                  {/* Category Dropdown */}
                  <div className="flex-1 relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-lg border border-warm-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-warm-700 dark:text-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 transition-all"
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <option>Loading...</option>
                      ) : (
                        categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-warm-500 dark:text-slate-400" />
                    </div>
                  </div>

                  {/* Search Toggle */}
                  <button
                    onClick={handleMobileSearchToggle}
                    className="p-2 text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Search topics"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* Search View - Clean Integration */
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-2 border border-warm-200/50 dark:border-slate-600/50">
                  <div className="relative">
                    {/* Back Button */}
                    <button
                      onClick={handleBackToFilter}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-1 text-warm-600 dark:text-slate-400 hover:text-warm-700 dark:hover:text-slate-300 transition-colors"
                      title="Back to filter"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-warm-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-warm-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 placeholder-warm-400 dark:placeholder-slate-500 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Desktop Description */}
            <div className="hidden md:block">
              <p className="text-sm md:text-lg text-warm-600 dark:text-slate-400 leading-relaxed">
                Connect, share, and discuss with fellow community members
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-warm-500 dark:text-slate-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live discussions</span>
                </span>
                <span>•</span>
                <span>Community guidelines apply</span>
              </div>
            </div>
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
