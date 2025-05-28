// Navigation component for app routing
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const Navigation = ({ currentPage, onNavigate }) => {
  const { user, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('users.current');
    return {
      user: Meteor.user(),
      isLoading: !handler.ready()
    };
  });

  const pages = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'forum', label: 'Forum', icon: '💬' },
    { id: 'chat', label: 'Chat', icon: '💭' },
    // Only show profile page if logged in
    ...(user ? [{ id: 'profile', label: 'Profile', icon: '👤' }] : []),
    // Only show admin page for users with admin role (you can add a check here later)
    ...(user ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : [])
  ];

  const handleLogout = () => {
    Meteor.logout();
  };

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
            
            {/* Login/Logout Button */}
            {!isLoading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                    bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <span>🚪</span>
                  <span className="hidden md:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                    bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <span>🔑</span>
                  <span className="hidden md:inline">Login</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
