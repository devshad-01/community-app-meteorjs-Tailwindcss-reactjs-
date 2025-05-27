import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/admin/Dashboard';
import { ForumPage } from './pages/ForumPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFound } from './pages/NotFound';
import { StyleTest } from './pages/StyleTest';

export const App = () => (
  <Router
    future={{
      v7_startTransition: true,  // Opt-in to React Router v7's use of startTransition
      v7_relativeSplatPath: true // Opt-in to React Router v7's relative path resolution within splat routes
    }}
  >
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
      <Route path="/forum" element={<MainLayout><ForumPage /></MainLayout>} />
      <Route path="/events" element={<MainLayout><EventsPage /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
      <Route path="/admin/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/style-test" element={<MainLayout><StyleTest /></MainLayout>} />
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  </Router>
);
