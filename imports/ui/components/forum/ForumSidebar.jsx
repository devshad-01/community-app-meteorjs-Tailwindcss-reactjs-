import React, { memo, useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

export const ForumSidebar = memo(({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  loading
}) => {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isOnlineExpanded, setIsOnlineExpanded] = useState(false);

  return (
    <div className="space-y-4 lg:space-y-6 animate-slideInLeft">
      {/* Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 transition-smooth">
        {/* Mobile: Collapsible Header */}
        <button
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className="lg:hidden w-full flex items-center justify-between p-4 hover:bg-warm-50 dark:hover:bg-slate-700/50 rounded-t-xl transition-colors"
        >
          <h3 className="text-lg font-semibold text-warm-900 dark:text-white">
            Categories
          </h3>
          {isCategoriesExpanded ? (
            <ChevronUp className="w-5 h-5 text-warm-600 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-warm-600 dark:text-slate-400" />
          )}
        </button>

        {/* Desktop: Always Visible Header */}
        <div className="hidden lg:block p-6 pb-4">
          <h3 className="text-lg font-semibold text-warm-900 dark:text-white">
            Posts Categories
          </h3>
        </div>

        {/* Categories Content */}
        <div className={`${isCategoriesExpanded ? 'block' : 'hidden'} lg:block px-4 lg:px-6 pb-4 lg:pb-6`}>
          {/* Mobile: Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {loading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="animate-pulse flex-shrink-0">
                    <div className="h-10 w-24 bg-warm-200 dark:bg-slate-600 rounded-lg"></div>
                  </div>
                ))
              ) : (
                categories.map(category => (
                  <button
                    key={category._id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCategoryChange(category._id);
                      setIsCategoriesExpanded(false); // Close on mobile after selection
                    }}
                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer whitespace-nowrap ${
                      selectedCategory === category._id
                        ? 'bg-warm-500 dark:bg-orange-600 text-white shadow-md'
                        : 'bg-warm-100 dark:bg-slate-700 text-warm-600 dark:text-slate-300 hover:bg-warm-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="text-sm">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                      {category.postCount || 0}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Desktop: Vertical List */}
          <div className="hidden lg:block space-y-2">
            {loading ? (
              Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-12 bg-warm-200 dark:bg-slate-600 rounded-lg"></div>
                </div>
              ))
            ) : (
              categories.map(category => (
                <button
                  key={category._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCategoryChange(category._id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
                    selectedCategory === category._id
                      ? 'bg-warm-50 dark:bg-orange-900/20 text-warm-700 dark:text-orange-300 shadow-sm'
                      : 'text-warm-600 dark:text-slate-400 hover:bg-warm-25 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-xs bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300 px-2 py-1 rounded-full">
                    {category.postCount || 0}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Online Members - Hidden on Mobile */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 transition-smooth">
        {/* Desktop: Always Visible Header */}
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-warm-900 dark:text-white flex items-center">
            <Users className="w-4 h-4 mr-2 text-green-500" />
            Online Now
          </h3>
        </div>

        {/* Online Members Content - Desktop Only */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {['Sarah Johnson', 'Michael Chen', 'Emma Wilson'].map(name => (
              <div key={name} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-warm-600 dark:text-slate-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
