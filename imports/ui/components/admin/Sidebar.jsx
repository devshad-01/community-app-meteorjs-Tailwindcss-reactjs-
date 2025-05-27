import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiMessageSquare, FiAlertCircle, FiPieChart, FiSettings } from 'react-icons/fi';

export const AdminSidebar = () => {
  const { pathname } = useLocation();
  
  const isActive = (path) => pathname === path || pathname.startsWith(path);
  
  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/users', icon: FiUsers, label: 'User Management' },
    { path: '/admin/events', icon: FiCalendar, label: 'Event Management' },
    { path: '/admin/forums', icon: FiMessageSquare, label: 'Forum Management' },
    { path: '/admin/reports', icon: FiAlertCircle, label: 'Reported Content' },
    { path: '/admin/analytics', icon: FiPieChart, label: 'Analytics' },
    { path: '/admin/settings', icon: FiSettings, label: 'System Settings' }
  ];

  return (
    <div className="card bg-dark bg-opacity-40">
      <div className="p-4 mb-4 border-b border-accent border-opacity-20">
        <div className="flex items-center">
          <div className="text-primary font-bold text-lg">Admin</div>
          <div className="text-white ml-2 font-light">Panel</div>
        </div>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive(item.path) 
                ? 'bg-primary bg-opacity-10 text-primary' 
                : 'hover:bg-accent hover:bg-opacity-20 text-muted hover:text-white'
            }`}
          >
            <item.icon className={`mr-3 ${isActive(item.path) ? 'text-primary' : ''}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
