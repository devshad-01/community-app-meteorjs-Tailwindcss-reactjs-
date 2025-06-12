import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Navigate, useLocation } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { Footer } from './Footer';

export const RouteRenderer = ({ children, userId, requireAdmin = false }) => {
  const location = useLocation();
  
  const { user } = useTracker(() => {
    return {
      user: Meteor.user(),
    };
  }, []);

  // Check admin access if required (only applies to authenticated users)
  if (requireAdmin && userId && user?.profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationBar userId={userId} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
