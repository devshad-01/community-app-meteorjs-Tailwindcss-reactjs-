// Main layout component
import React from 'react';

export const MainLayout = ({ children }) => (
  <div className="main-layout">
    <header>
      <h1>Community App</h1>
    </header>
    <main>
      {children}
    </main>
    <footer>
      <p>© 2025 Community App</p>
    </footer>
  </div>
);
