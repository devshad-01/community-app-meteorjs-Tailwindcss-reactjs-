import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiBell, 
  FiChevronDown, 
  FiMessageSquare 
} from 'react-icons/fi';

export const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Mock user data - would be replaced with actual user data from Meteor.user()
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null, // if null, display initials
    isAdmin: true
  };
  
  // Use provided user data or mock data
  const userData = user || mockUser;
  
  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Logout handler
  const handleLogout = () => {
    console.log('Logging out...');
    // TODO: Implement actual logout with Meteor.logout()
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-3">
        {/* Notification button */}
        <button className="p-1.5 text-muted hover:text-primary transition-colors rounded-md" aria-label="Notifications">
          <div className="relative">
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
        </button>
        
        {/* Messages button */}
        <Link to="/messages" className="p-1.5 text-muted hover:text-primary transition-colors rounded-md" aria-label="Messages">
          <FiMessageSquare size={20} />
        </Link>
        
        {/* User dropdown button */}
        <button 
          className="flex items-center space-x-2 p-1 rounded-md hover:bg-accent hover:bg-opacity-30 transition-colors"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt={userData.name} 
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="font-medium">{getInitials(userData.name)}</span>
            )}
          </div>
          <FiChevronDown size={16} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg border border-accent cyber-border bg-dark z-10">
          <div className="py-2 px-4 border-b border-accent border-opacity-25">
            <p className="font-medium">{userData.name}</p>
            <p className="text-sm text-muted truncate">{userData.email}</p>
          </div>
          <div className="py-1">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:bg-opacity-20"
              onClick={() => setIsOpen(false)}
            >
              <FiUser className="mr-2 text-muted" />
              <span>Your Profile</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:bg-opacity-20"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings className="mr-2 text-muted" />
              <span>Account Settings</span>
            </Link>
            {userData.isAdmin && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:bg-opacity-20 border-t border-accent border-opacity-25"
                onClick={() => setIsOpen(false)}
              >
                <div className="mr-2 rounded-full h-2 w-2 bg-primary"></div>
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
          <div className="py-1 border-t border-accent border-opacity-25">
            <button 
              onClick={handleLogout}
              className="flex w-full text-left items-center px-4 py-2 text-sm hover:bg-accent hover:bg-opacity-20 text-red-400 hover:text-red-300"
            >
              <FiLogOut className="mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
