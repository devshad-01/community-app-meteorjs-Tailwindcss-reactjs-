import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="text-primary text-9xl font-bold mb-6 opacity-60">404</div>
    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
    <p className="text-muted mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <button onClick={() => window.history.back()} className="btn btn-outline">
        <FiArrowLeft className="mr-2" /> Go Back
      </button>
      <Link to="/" className="btn btn-primary">
        <FiHome className="mr-2" /> Go Home
      </Link>
    </div>
  </div>
);
