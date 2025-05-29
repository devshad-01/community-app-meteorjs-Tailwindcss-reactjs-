import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const ProtectedRoute = ({ children, requireAdmin = false, fallback = null }) => {
  const { user, isLoading } = useTracker(() => {
    return {
      user: Meteor.user(),
      isLoading: Meteor.loggingIn()
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">You must be logged in to access this page.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (requireAdmin && user.profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};
