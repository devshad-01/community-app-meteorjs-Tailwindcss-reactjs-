// Header component
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import { UserMenu } from './UserMenu';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authentication state

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => pathname === path ? 'nav-link-active' : '';

  return (
    <header className="bg-dark backdrop-blur-md bg-opacity-90 border-b border-primary border-opacity-20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary text-xl font-bold">Community</span>
            <span className="text-white text-xl font-light">App</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/events" className={`nav-link ${isActive('/events')}`}>Events</Link>
            <Link to="/forum" className={`nav-link ${isActive('/forum')}`}>Forums</Link>
            
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <FiUser className="mr-1 inline" /> Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white hover:text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link 
              to="/" 
              className={`block py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md ${isActive('/')}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className={`block py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md ${isActive('/events')}`}
              onClick={toggleMenu}
            >
              Events
            </Link>
            <Link 
              to="/forum" 
              className={`block py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md ${isActive('/forum')}`}
              onClick={toggleMenu}
            >
              Forums
            </Link>
            
            {isAuthenticated ? (
              <div className="border-t border-accent border-opacity-25 mt-4 pt-4">
                <Link 
                  to="/profile"
                  className="block py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md"
                  onClick={toggleMenu}
                >
                  <FiUser className="mr-1 inline" /> My Profile
                </Link>
                <button 
                  className="block w-full text-left py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md text-red-400"
                  onClick={() => {
                    toggleMenu();
                    setIsAuthenticated(false);
                  }}
                >
                  <FiLogIn className="mr-1 inline" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-accent border-opacity-25 mt-4 pt-4 flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="block py-2 px-4 hover:bg-accent hover:bg-opacity-30 rounded-md"
                  onClick={toggleMenu}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="block py-2 px-4 bg-primary bg-opacity-10 text-primary rounded-md"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
