import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {
  Bell, Calendar, MessageSquare, Settings, LogOut, Menu, X, Home, 
  ChevronDown, User, Shield, Users, CircleDot
} from 'lucide-react';
import { NotificationDropdown } from '../notifications';
import { NotificationsCollection } from '/imports/api/notifications';
import { UserAvatar } from './UserAvatar';

export const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  
  // Refs for click outside detection
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, isLoading, unreadNotificationCount } = useTracker(() => {
    const currentUser = Meteor.user();
    
    // Subscribe to notifications if user is logged in
    let unreadCount = 0;
    if (currentUser) {
      const handle = Meteor.subscribe('userNotifications', { onlyUnread: true });
      if (handle.ready()) {
        unreadCount = NotificationsCollection.find({
          userId: currentUser._id,
          read: false
        }).count();
      }
    }
    
    return {
      user: currentUser,
      isLoading: Meteor.loggingIn(),
      unreadNotificationCount: unreadCount,
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items - only shown when logged in
  const navigationItems = [
    { 
      id: 'home', 
      name: 'Home', 
      href: '/', 
      icon: Home,
      description: 'Dashboard and overview'
    },
    { 
      id: 'events', 
      name: 'Events', 
      href: '/events', 
      icon: Calendar,
      description: 'Community events and meetings'
    },
    { 
      id: 'forum', 
      name: 'Forum', 
      href: '/forum', 
      icon: MessageSquare,
      description: 'Community discussions'
    },
    { 
      id: 'members', 
      name: 'Members', 
      href: '/members', 
      icon: Users,
      description: 'Community members'
    },
  ];

  // Admin-only navigation
  const adminNavigation = [
    { 
      id: 'admin', 
      name: 'Admin Panel', 
      href: '/admin', 
      icon: Shield,
      description: 'Administrative controls'
    },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve, reject) => {
        Meteor.logout((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
    }
  };

  const isAdmin = user?.profile?.role === 'admin';
  const isAuthenticated = !!user && !isLoading;

  // Helper functions for user roles and colors
  const getUserRole = (userId) => {
    const userData = userId ? Meteor.users.findOne(userId) : user;
    return userData?.profile?.role || 'member';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'red',
      'member': 'purple'
    };
    return colors[role] || 'purple';
  };

  const getUserInitial = () => {
    if (user?.profile?.name) {
      return user.profile.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.emails?.[0]?.address) {
      return user.emails[0].address.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.profile?.name || user?.username || 'User';
  };

  const getUserAvatar = () => {
    return user?.profile?.avatar || null;
  };

  const NavLink = ({ item, className = "", onClick }) => {
    const Icon = item.icon;
    return (
      <Link
        to={item.href}
        className={`group flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium hover:text-white transition-all duration-200 ${className}`}
        onClick={onClick}
        title={item.description}
      >
        <Icon className={`w-5 h-5 transition-transform duration-300  ${
          isActive(item.href) ? 'scale-110 text-white-800' : 'group-hover:scale-105'
        }`} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-slate-700 border-b border-slate-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-amber-500 transition-all duration-300">
                  Community
                </span>
                <span className="flex items-center text-xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300">
                  <CircleDot className="w-5 h-5 mr-0.5 text-orange-400 group-hover:text-orange-500 transition-colors duration-300" />
                  Hub
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map(item => (
                <NavLink
                  key={item.id}
                  item={item}
                  className={`text-white ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-blue-400 shadow-lg'
                      : 'hover:bg-slate-800 hover:text-blue-400'
                  }`}
                />
              ))}

              {isAdmin && adminNavigation.map(item => (
                <NavLink
                  key={item.id}
                  item={item}
                  className={`text-white ${
                    isActive(item.href)
                      ? 'bg-slate-800 text-amber-400 shadow-lg'
                      : 'hover:bg-slate-800 hover:text-amber-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                      </span>
                    )}
                  </button>
                  
                  <NotificationDropdown 
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <UserAvatar 
                      user={user}
                      size="sm"
                      showTooltip={false}
                      getRoleColor={getRoleColor}
                      getUserRole={getUserRole}
                    />
                    <span className="hidden sm:block text-sm font-medium">{getUserDisplayName()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-slate-700 bg-slate-750">
                        <div className="flex items-center space-x-3">
                          <UserAvatar 
                            user={user}
                            size="lg"
                            showTooltip={false}
                            getRoleColor={getRoleColor}
                            getUserRole={getUserRole}
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                            <p className="text-xs text-slate-400">@{user?.username || 'username'}</p>
                            <p className="text-xs text-slate-400">{user?.emails?.[0]?.address}</p>
                          </div>
                        </div>
                        {isAdmin && (
                          <span className="inline-block mt-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </Link>
                      

                      
                      <div className="border-t border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-750 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              /* Auth buttons for non-authenticated users */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white hover:bg-slate-300 text-orange-500 font-medium rounded-lg transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu - Only show when authenticated and menu is open */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="px-2 py-4 space-y-1">
              {navigationItems.map(item => (
                <NavLink
                  key={item.id}
                  item={item}
                  className={`text-white ${
                    isActive(item.href)
                      ? 'bg-slate-700 text-blue-400'
                      : 'hover:bg-slate-700 hover:text-blue-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
              
              {isAdmin && adminNavigation.map(item => (
                <NavLink
                  key={item.id}
                  item={item}
                  className={`text-white ${
                    isActive(item.href)
                      ? 'bg-slate-700 text-amber-400'
                      : 'hover:bg-slate-700 hover:text-amber-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};