import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { RouteRenderer } from './components/common/RouteRenderer';
import { ToastProvider } from './components/common/ToastProvider';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { ForumPage } from './pages/ForumPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { MembersPage } from './pages/MembersPage';
import { AdminPage } from './pages/admin/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  const userId = useTracker(() => Meteor.userId());

  // still loading data from backend
  if (userId === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Routes>
        {/* Public routes - accessible when not logged in */}
        <Route 
          path="/login" 
          element={
            userId ? <Navigate to="/" replace /> : (
              <RouteRenderer userId={userId}>
                <LoginPage />
              </RouteRenderer>
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            userId ? <Navigate to="/" replace /> : (
              <RouteRenderer userId={userId}>
                <RegisterPage />
              </RouteRenderer>
            )
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/events" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <EventsPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/forum" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <ForumPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/forum/post/:postId" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <PostDetailPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/chat" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <ChatPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <ProfilePage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/members" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <MembersPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Admin-only routes */}
        <Route 
          path="/admin" 
          element={
            userId ? (
              <RouteRenderer userId={userId} requireAdmin={true}>
                <AdminPage />
              </RouteRenderer>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Home route - accessible to all but shows different content */}
        <Route 
          path="/" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <HomePage />
              </RouteRenderer>
            ) : (
              <RouteRenderer userId={userId}>
                <HomePage userId={userId} />
              </RouteRenderer>
            )
          } 
        />
        
        {/* Catch-all route */}
        <Route 
          path="*" 
          element={
            userId ? (
              <RouteRenderer userId={userId}>
                <NotFoundPage />
              </RouteRenderer>
            ) : (
              <RouteRenderer userId={userId}>
                <NotFoundPage />
              </RouteRenderer>
            )
          } 
        />
      </Routes>
    </ToastProvider>
  );
};
