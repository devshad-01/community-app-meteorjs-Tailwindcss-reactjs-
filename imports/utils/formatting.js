import { formatDistanceToNow } from 'date-fns';

// Format full date and time
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Format date only
export const formatDateOnly = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Format time only
export const formatTime = (date) => {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(date).toLocaleTimeString(undefined, options);
};

// Format as relative time (e.g., "5 minutes ago")
export const formatRelativeTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

// Format for calendar display
export const formatCalendarDate = (date) => {
  const options = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Utility function for string truncation
export const truncateString = (str, maxLength = 100) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
