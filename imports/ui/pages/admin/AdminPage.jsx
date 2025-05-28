import React from 'react';

export const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ⚙️ Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This is the admin dashboard where you can manage users and site content.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
              <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">User Management</h2>
              <p className="text-gray-700 dark:text-gray-400">
                View, edit and manage user accounts
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">Content Management</h2>
              <p className="text-gray-700 dark:text-gray-400">
                Manage site content and pages
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-3">Event Management</h2>
              <p className="text-gray-700 dark:text-gray-400">
                Create and manage events
              </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-100 dark:border-amber-800">
              <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-3">System Settings</h2>
              <p className="text-gray-700 dark:text-gray-400">
                Configure system settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};