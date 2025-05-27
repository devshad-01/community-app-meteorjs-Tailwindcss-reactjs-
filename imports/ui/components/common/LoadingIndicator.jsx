import React from 'react';

export const LoadingIndicator = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`${sizeClasses[size]} border-t-primary border-l-primary border-r-primary border-b-transparent rounded-full animate-spin`}
      />
      {message && <p className="mt-4 text-muted">{message}</p>}
    </div>
  );
};
