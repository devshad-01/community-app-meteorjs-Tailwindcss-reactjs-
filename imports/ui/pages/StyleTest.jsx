import React from 'react';

export const StyleTest = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6">Style Test Page</h1>
      
      <div className="mb-8">
        <h2 className="mb-4">Button Styles</h2>
        <div className="flex space-x-4 mb-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-outline">Outline Button</button>
          <button className="btn bg-accent text-white">Custom Button</button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4">Card Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="mb-2">Basic Card</h3>
            <p className="text-muted">This is a basic card component with custom styling.</p>
          </div>
          
          <div className="card cyber-border">
            <h3 className="mb-2">Cyber Border Card</h3>
            <p className="text-muted">This card has the custom cyber border effect.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4">Text &amp; Color Styles</h2>
        <p className="text-primary mb-2">Primary Color Text</p>
        <p className="text-accent mb-2">Accent Color Text</p>
        <p className="text-muted mb-2">Muted Color Text</p>
        <p className="bg-primary text-dark p-2 inline-block mb-2">Primary Background</p>
        <p className="bg-accent text-white p-2 inline-block mb-2">Accent Background</p>
      </div>
    </div>
  );
};
