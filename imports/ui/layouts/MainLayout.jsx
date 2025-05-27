// Main layout component
import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { useLocation } from 'react-router-dom';

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <Header />
      <main className={`flex-grow ${isHomePage ? '' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
