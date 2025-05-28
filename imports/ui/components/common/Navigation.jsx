// Navigation component for app routing
import React from 'react';

export const Navigation = ({ currentPage, onNavigate }) => {
  const pages = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'forum', label: 'Forum', icon: '💬' },
    { id: 'chat', label: 'Chat', icon: '💭' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'admin', label: 'Admin', icon: '⚙️' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Community App
            </span>
          </div>
          
          <div className="flex space-x-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                  ${currentPage === page.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{page.icon}</span>
                <span className="hidden md:inline">{page.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
