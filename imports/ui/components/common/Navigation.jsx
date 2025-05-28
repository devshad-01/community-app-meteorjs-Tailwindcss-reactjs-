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
    Meteor.logout(() => {
      // Redirect to home page after logout
      onNavigate('home');
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Community App
              </span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group
                  ${currentPage === page.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400'
                  }
                `}
              >
                <span className="group-hover:scale-110 transition-transform duration-200">{page.icon}</span>
                <span className="hidden md:inline">{page.label}</span>
              </button>
            ))}
            
            {/* Login/Logout Button */}
            {!isLoading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group
                    bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-sm"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">🚪</span>
                  <span className="hidden md:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group
                    bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">🔑</span>
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
