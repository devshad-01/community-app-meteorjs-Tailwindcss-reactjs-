import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';

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
    return fallback || <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
