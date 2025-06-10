import React, { memo } from 'react';
import { Users } from 'lucide-react';

export const ForumSidebar = memo(({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  loading
}) => {
  return (
    <div className="space-y-6 animate-slideInLeft">
      {/* Categories */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 p-6 transition-smooth">
        <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4">
          Posts Categories
        </h3>
        <div className="space-y-2">
          {loading ? (
            // Loading skeleton for categories
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
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
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

      {/* Online Members */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4 flex items-center">
          <Users className="w-4 h-4 mr-2 text-green-500" />
          Online Now
        </h3>
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
  );
});
