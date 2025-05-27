import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

export const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large', 'full'
  showCloseButton = true,
}) => {
  // Close when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Modal width based on size prop
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full'
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className={`relative transform overflow-hidden rounded-lg bg-background border border-accent shadow-glow transition-all 
            sm:my-8 sm:w-full ${sizeClasses[size]} cyber-border`}
          onClick={e => e.stopPropagation()}
        >
          {showCloseButton && (
            <button 
              type="button" 
              className="absolute right-3 top-3 text-muted hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          )}
          
          {title && (
            <div className="bg-primary bg-opacity-5 px-4 py-3 border-b border-accent">
              <h3 className="text-lg font-medium">{title}</h3>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
