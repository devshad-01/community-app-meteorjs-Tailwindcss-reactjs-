import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export const Alert = ({ 
  type = 'info',    // 'info', 'success', 'warning', 'error'
  message,
  closable = true,
  onClose = () => {}
}) => {
  const alertTypes = {
    info: {
      background: 'bg-blue-500 bg-opacity-10',
      border: 'border-blue-500',
      text: 'text-blue-300',
      icon: <FiInfo className="text-blue-400" />
    },
    success: {
      background: 'bg-green-500 bg-opacity-10',
      border: 'border-green-500',
      text: 'text-green-300',
      icon: <FiCheckCircle className="text-green-400" />
    },
    warning: {
      background: 'bg-yellow-500 bg-opacity-10',
      border: 'border-yellow-500',
      text: 'text-yellow-300',
      icon: <FiAlertCircle className="text-yellow-400" />
    },
    error: {
      background: 'bg-red-500 bg-opacity-10',
      border: 'border-red-500',
      text: 'text-red-300',
      icon: <FiAlertCircle className="text-red-400" />
    },
  };

  const alertStyle = alertTypes[type];

  return (
    <div className={`flex items-center p-4 rounded-md border ${alertStyle.background} ${alertStyle.border}`}>
      <div className="flex-shrink-0 mr-3">
        {alertStyle.icon}
      </div>
      <div className={`flex-grow ${alertStyle.text}`}>
        {message}
      </div>
      {closable && (
        <button 
          onClick={onClose}
          className="ml-3 text-muted hover:text-white transition-colors"
          aria-label="Close"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};
