import React, { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Send, X, Users, MessageCircle } from 'lucide-react';
import { MessagesCollection } from '../../../api/messages';

export const GeneralChat = ({ isOpen, onClose, user }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  // Subscribe to messages and online users
  const { messages, onlineUsers, loading } = useTracker(() => {
    const messagesHandle = Meteor.subscribe('generalChatMessages', { limit: 50 });
    const usersHandle = Meteor.subscribe('usersBasic');
    
    return {
      messages: MessagesCollection.find(
        { type: 'general' }, 
        { sort: { createdAt: 1 } }
      ).fetch(),
      onlineUsers: Meteor.users.find(
        { 'status.online': true },
        { fields: { username: 1, profile: 1, status: 1 } }
      ).fetch(),
      loading: !messagesHandle.ready() || !usersHandle.ready()
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await Meteor.callAsync('messages.sendGeneral', {
        content: newMessage.trim()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserDisplayName = (userId) => {
    const user = Meteor.users.findOne(userId);
    return user?.profile?.name || user?.username || 'Anonymous';
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-warm-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-warm-900 dark:text-white">
              General Chat
            </h3>
            <p className="text-sm text-warm-600 dark:text-slate-400">
              {onlineUsers.length} online
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-warm-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Online Users Bar */}
      <div className="p-3 bg-warm-50 dark:bg-slate-700/50 border-b border-warm-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-warm-600 dark:text-slate-400" />
          <span className="text-warm-700 dark:text-slate-300 font-medium">Online:</span>
          <div className="flex flex-wrap gap-1">
            {onlineUsers.slice(0, 8).map(user => (
              <span
                key={user._id}
                className="px-2 py-1 bg-warm-200 dark:bg-slate-600 text-warm-800 dark:text-slate-200 rounded-full text-xs"
              >
                {user.profile?.name || user.username}
              </span>
            ))}
            {onlineUsers.length > 8 && (
              <span className="text-warm-600 dark:text-slate-400 text-xs">
                +{onlineUsers.length - 8} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-warm-600 dark:text-slate-400">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getUserDisplayName(message.userId).charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-warm-900 dark:text-white">
                    {getUserDisplayName(message.userId)}
                  </span>
                  <span className="text-xs text-warm-500 dark:text-slate-400">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-warm-700 dark:text-slate-300 break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-warm-200 dark:border-slate-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? "Type a message..." : "Please log in to chat"}
            disabled={!user || isSubmitting}
            className="flex-1 px-4 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-warm-900 dark:text-white placeholder-warm-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!user || !newMessage.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-warm-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {newMessage.length > 450 && (
          <p className="text-xs text-warm-500 dark:text-slate-400 mt-1">
            {500 - newMessage.length} characters remaining
          </p>
        )}
      </form>
    </div>
  );
};