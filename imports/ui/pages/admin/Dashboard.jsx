// Admin Dashboard page component
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMessageSquare, FiAlertCircle, FiSettings, FiPieChart } from 'react-icons/fi';

export const Dashboard = () => {
  // Mock statistics - would normally come from backend
  const stats = {
    users: 124,
    events: 18,
    posts: 237,
    reports: 3
  };
  
  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registered', user: 'Emily Johnson', time: '10 minutes ago' },
    { id: 2, type: 'event', action: 'Event created', user: 'Michael Smith', time: '2 hours ago' },
    { id: 3, type: 'forum', action: 'Post reported', user: 'Sarah Williams', time: '5 hours ago' },
    { id: 4, type: 'user', action: 'User role updated', user: 'Admin', time: '1 day ago' },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted">Manage community platform settings and monitor activity.</p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card bg-dark bg-opacity-40">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
              <FiUsers className="text-primary text-2xl" />
            </div>
            <div>
              <p className="text-muted">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.users}</h3>
            </div>
          </div>
        </div>
        
        <div className="card bg-dark bg-opacity-40">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
              <FiCalendar className="text-primary text-2xl" />
            </div>
            <div>
              <p className="text-muted">Active Events</p>
              <h3 className="text-2xl font-bold">{stats.events}</h3>
            </div>
          </div>
        </div>
        
        <div className="card bg-dark bg-opacity-40">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
              <FiMessageSquare className="text-primary text-2xl" />
            </div>
            <div>
              <p className="text-muted">Forum Posts</p>
              <h3 className="text-2xl font-bold">{stats.posts}</h3>
            </div>
          </div>
        </div>
        
        <div className="card bg-dark bg-opacity-40">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg mr-4">
              <FiAlertCircle className="text-primary text-2xl" />
            </div>
            <div>
              <p className="text-muted">Reports</p>
              <h3 className="text-2xl font-bold">{stats.reports}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin navigation */}
        <div className="card bg-dark bg-opacity-40">
          <h3 className="text-xl font-semibold mb-4">Management</h3>
          
          <nav className="space-y-2">
            <Link to="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiUsers className="mr-3 text-primary" />
              <span>User Management</span>
            </Link>
            <Link to="/admin/events" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiCalendar className="mr-3 text-primary" />
              <span>Event Management</span>
            </Link>
            <Link to="/admin/forums" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiMessageSquare className="mr-3 text-primary" />
              <span>Forum Management</span>
            </Link>
            <Link to="/admin/reports" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiAlertCircle className="mr-3 text-primary" />
              <span>Reported Content</span>
            </Link>
            <Link to="/admin/analytics" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiPieChart className="mr-3 text-primary" />
              <span>Analytics</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center p-3 rounded-lg hover:bg-accent hover:bg-opacity-20">
              <FiSettings className="mr-3 text-primary" />
              <span>System Settings</span>
            </Link>
          </nav>
        </div>
        
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <div className="card bg-dark bg-opacity-40 h-full">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="p-3 border-l-2 border-primary bg-accent bg-opacity-10 rounded-r-lg">
                  <p className="font-medium">{activity.action}</p>
                  <div className="flex justify-between text-sm text-muted mt-1">
                    <span>by {activity.user}</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/admin/activity" className="text-primary hover:underline">
                View All Activity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
