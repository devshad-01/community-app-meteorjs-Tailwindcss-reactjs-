// Footer component
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

export const Footer = () => (
  <footer className="bg-dark mt-auto border-t border-primary border-opacity-20">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-primary font-semibold mb-4">Community App</h3>
          <p className="text-muted">
            A comprehensive platform for faith communities to engage with each other.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-muted hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/events" className="text-muted hover:text-primary transition-colors">Events</Link></li>
            <li><Link to="/forum" className="text-muted hover:text-primary transition-colors">Forums</Link></li>
            <li><Link to="/profile" className="text-muted hover:text-primary transition-colors">My Account</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/help" className="text-muted hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link to="/terms" className="text-muted hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/contact" className="text-muted hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <FiMail size={20} />
            </a>
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <FiGithub size={20} />
            </a>
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="text-muted hover:text-primary transition-colors">
              <FiInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="h-px w-full bg-divider-line opacity-30 my-6"></div>
      
      <div className="text-center text-muted text-sm">
        <p>&copy; {new Date().getFullYear()} Community App. Built by the community for the community.</p>
      </div>
    </div>
  </footer>
);
