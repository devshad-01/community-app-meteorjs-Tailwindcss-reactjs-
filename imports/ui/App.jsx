import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Navigation } from './components/common/Navigation';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { ForumPage } from './pages/ForumPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/admin/AdminPage';
import { LoginPage } from './pages/LoginPage';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Track user authentication state
  const { user, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('users.current');
    return {
      user: Meteor.user(),
      isLoading: !subscription.ready()
    };
  });

  const renderPage = () => {
    // If user is logged in and on login page, redirect to home
    if (!isLoading && user && currentPage === 'login') {
      setCurrentPage('home');
      return <HomePage />;
    }

    // Redirect to login page if trying to access protected pages while not logged in
    if (!isLoading && !user && ['profile', 'admin', 'chat'].includes(currentPage)) {
      setCurrentPage('login');
      return <LoginPage />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'events':
        return <EventsPage />;
      case 'forum':
        return <ForumPage />;
      case 'chat':
        return <ChatPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      {renderPage()}
    </div>
  );
};
 