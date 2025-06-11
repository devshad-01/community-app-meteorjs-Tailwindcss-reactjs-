import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Heart, User, FileText, Clock } from 'lucide-react';
import { NotificationsCollection } from '/imports/api/notifications';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const { notifications, unreadCount, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('userNotifications');
    const notificationsList = NotificationsCollection.find(
      { userId: Meteor.userId() },
      { 
        sort: { createdAt: -1 },
        limit: 20
      }
    ).fetch();

    const unread = NotificationsCollection.find({
      userId: Meteor.userId(),
      read: false
    }).count();

    return {
      notifications: notificationsList,
      unreadCount: unread,
      isLoading: !handle.ready()
    };
  }, []);

  const handleMarkAsRead = (notificationId) => {
    if (notificationId) {
      Meteor.call('notifications.markAsRead', notificationId, (error) => {
        if (error) {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  };

  const handleMarkAllAsRead = () => {
    Meteor.call('notifications.markAllAsRead', (error) => {
      if (error) {
        console.error('Error marking all notifications as read:', error);
      }
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_POST':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'NEW_REPLY':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'POST_LIKED':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'MENTION':
        return <User className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    
    // Navigate to relevant page based on notification type
    try {
      switch (notification.type) {
        case 'NEW_POST':
        case 'POST_LIKED':
          if (notification.relatedId) {
            navigate(`/forum/post/${notification.relatedId}`);
          }
          break;
        case 'NEW_REPLY':
        case 'MENTION':
          if (notification.relatedType === 'post' && notification.data?.postId) {
            navigate(`/forum/post/${notification.data.postId}`);
          } else if (notification.relatedType === 'reply' && notification.data?.postId) {
            navigate(`/forum/post/${notification.data.postId}`);
          } else if (notification.relatedType === 'message') {
            navigate('/forum'); // Navigate to forum and open chat
          }
          break;
        case 'NEW_MESSAGE':
          navigate('/forum'); // Navigate to forum page where chat can be opened
          break;
        default:
          console.log('Unknown notification type:', notification.type);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute -right-1 mt-2  bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-750">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="px-4 py-6 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`px-4 py-3 hover:bg-slate-750 cursor-pointer border-l-4 transition-colors ${
                !notification.read 
                  ? 'border-blue-500 bg-slate-750/50' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    !notification.read ? 'font-medium text-white' : 'text-slate-300'
                  }`}>
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {notification.message}
                    </p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(notification.createdAt)}
                  </div>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-750">
          <button
            onClick={onClose}
            className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors text-center"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};
