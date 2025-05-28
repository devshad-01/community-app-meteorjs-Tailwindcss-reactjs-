import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {
  Bell, Calendar, MessageSquare, Settings, LogOut, Menu, X, Home, ChevronDown
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const { user, isLoading } = useTracker(() => {
    if (!Meteor.user || typeof Meteor.user !== 'function') {
      return { user: null, isLoading: true };
    }
    return {
      user: Meteor.user(),
      isLoading: Meteor.loggingIn(),
    };
  }, []);

  const mainNavigation = [
    { id: 'home', name: 'Home', href: '/', icon: <Home className="w-5 h-5 text-white" /> },
    { id: 'events', name: 'Events', href: '/events', icon: <Calendar className="w-5 h-5 text-white" /> },
    { id: 'forum', name: 'Forum', href: '/forum', icon: <FontAwesomeIcon icon={faComments} className="w-4 h-4 text-white" /> },
    { id: 'chat', name: 'Chat', href: '/chat', icon: <MessageSquare className="w-5 h-5 text-white" /> },
  ];

  const adminNavigation = [
    { id: 'admin', name: 'Admin', href: '/admin', icon: <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-white" /> },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (Meteor.logout && typeof Meteor.logout === 'function') {
      Meteor.logout(err => {
        if (err) console.error('Logout error:', err);
      });
    }
    setShowUserMenu(false);
  };

  const isAdmin = user?.profile?.role === 'admin';

  const mockNotifications = [
    { id: 1, title: 'New event: Team Meeting', time: '2 minutes ago' },
    { id: 2, title: 'New forum post in General', time: '5 minutes ago' },
    { id: 3, title: 'Message from John Doe', time: '10 minutes ago' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-warm-200 dark:border-warm-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white animate-fade-in">CommunityHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavigation.map(item => (
              <Link
                key={item.id}
                to={item.href}
                className={`group flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-white
                  ${isActive(item.href)
                    ? 'bg-warm-100 dark:bg-warm-900 shadow-warm'
                    : 'hover:bg-warm-50 dark:hover:bg-warm-800'}
                `}
              >
                <span className={`transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="text-white">{item.name}</span>
              </Link>
            ))}

            {isAdmin && adminNavigation.map(item => (
              <Link
                key={item.id}
                to={item.href}
                className={`group flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-white
                  ${isActive(item.href)
                    ? 'bg-warm-100 dark:bg-warm-900 shadow-warm'
                    : 'hover:bg-warm-50 dark:hover:bg-warm-800'}
                `}
              >
                <span className={`transition-transform duration-200 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="text-white">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-white hover:bg-warm-50 dark:hover:bg-warm-800 rounded-md transition-colors"
                  >
                    <Bell className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-popover rounded-md shadow-lg border border-warm-200 dark:border-warm-800 py-1 z-50">
                      <div className="px-4 py-2 border-b border-warm-200 dark:border-warm-800">
                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                      </div>
                      {mockNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-warm-50 dark:hover:bg-warm-800 cursor-pointer"
                        >
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="text-xs text-white">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-white hover:bg-warm-50 dark:hover:bg-warm-800 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 bg-warm-600 dark:bg-warm-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.profile?.name?.charAt(0) || user.emails?.[0]?.address?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-popover rounded-md shadow-lg border border-warm-200 dark:border-warm-800 py-1 z-50">
                      <div className="px-4 py-3 border-b border-warm-200 dark:border-warm-800">
                        <p className="text-sm font-medium text-white">{user.profile?.name || 'User'}</p>
                        <p className="text-xs text-white">{user.emails?.[0]?.address}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-white hover:bg-warm-50 dark:hover:bg-warm-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-white hover:bg-warm-50 dark:hover:bg-warm-800 flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 text-white" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-warm-50 dark:hover:bg-warm-800 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4 text-white" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:underline font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
