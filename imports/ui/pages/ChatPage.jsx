// Chat page component with placeholder content
import React, { useState, useRef, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const ChatPage = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useTracker(() => {
    return {
      user: Meteor.user()
    };
  });

  // Mock data - replace with actual Meteor collections later
  const channels = [
    { 
      id: 'general', 
      name: 'General', 
      description: 'General community chat',
      memberCount: 156,
      unreadCount: 3,
      lastMessage: 'Hey everyone! How is your day going?',
      lastMessageTime: '2025-05-28T14:30:00Z'
    },
    { 
      id: 'prayer', 
      name: 'Prayer Circle', 
      description: 'Share prayer requests and praises',
      memberCount: 89,
      unreadCount: 0,
      lastMessage: 'Thank you all for your prayers during my surgery...',
      lastMessageTime: '2025-05-28T13:45:00Z'
    },
    { 
      id: 'events', 
      name: 'Events Planning', 
      description: 'Discuss upcoming events',
      memberCount: 34,
      unreadCount: 7,
      lastMessage: 'Should we have the picnic on Saturday or Sunday?',
      lastMessageTime: '2025-05-28T12:20:00Z'
    },
    { 
      id: 'youth', 
      name: 'Youth Group', 
      description: 'Teenagers and young adults',
      memberCount: 42,
      unreadCount: 1,
      lastMessage: 'Game night this Friday! Who\'s in?',
      lastMessageTime: '2025-05-28T11:15:00Z'
    },
    { 
      id: 'bible-study', 
      name: 'Bible Study', 
      description: 'Scripture discussion and learning',
      memberCount: 67,
      unreadCount: 0,
      lastMessage: 'Great insights on Romans 8 today!',
      lastMessageTime: '2025-05-28T10:30:00Z'
    }
  ];

  const messages = {
    general: [
      {
        id: 1,
        user: 'Sarah Johnson',
        userId: 'user1',
        message: 'Good morning everyone! Beautiful day today ☀️',
        timestamp: '2025-05-28T09:00:00Z',
        type: 'message',
        reactions: [
          { emoji: '☀️', users: ['user2', 'user3'], count: 2 },
          { emoji: '🙏', users: ['user4'], count: 1 }
        ]
      },
      {
        id: 2,
        user: 'Michael Chen',
        userId: 'user2',
        message: 'Morning Sarah! Hope everyone has a blessed day ahead',
        timestamp: '2025-05-28T09:15:00Z',
        type: 'message',
        reactions: []
      },
      {
        id: 3,
        user: 'Emma Wilson',
        userId: 'user3',
        message: 'Just wanted to share this beautiful verse I read this morning: "This is the day that the Lord has made; let us rejoice and be glad in it." - Psalm 118:24',
        timestamp: '2025-05-28T10:30:00Z',
        type: 'message',
        reactions: [
          { emoji: '🙏', users: ['user1', 'user2', 'user4', 'user5'], count: 4 },
          { emoji: '❤️', users: ['user1', 'user6'], count: 2 }
        ]
      },
      {
        id: 4,
        user: 'System',
        userId: 'system',
        message: 'Jennifer Adams joined the channel',
        timestamp: '2025-05-28T11:00:00Z',
        type: 'system',
        reactions: []
      },
      {
        id: 5,
        user: 'Jennifer Adams',
        userId: 'user6',
        message: 'Hello everyone! Excited to be part of this community 👋',
        timestamp: '2025-05-28T11:05:00Z',
        type: 'message',
        reactions: [
          { emoji: '👋', users: ['user1', 'user2', 'user3'], count: 3 },
          { emoji: '🎉', users: ['user1'], count: 1 }
        ]
      },
      {
        id: 6,
        user: 'Pastor David',
        userId: 'pastor1',
        message: 'Welcome Jennifer! We\'re so glad to have you here. Don\'t hesitate to reach out if you have any questions.',
        timestamp: '2025-05-28T11:10:00Z',
        type: 'message',
        reactions: []
      },
      {
        id: 7,
        user: 'Mary Thompson',
        userId: 'user7',
        message: 'Hey everyone! How is your day going?',
        timestamp: '2025-05-28T14:30:00Z',
        type: 'message',
        reactions: []
      }
    ]
  };

  const onlineUsers = [
    { id: 'user1', name: 'Sarah Johnson', status: 'online', lastSeen: 'now' },
    { id: 'user2', name: 'Michael Chen', status: 'online', lastSeen: 'now' },
    { id: 'user3', name: 'Emma Wilson', status: 'away', lastSeen: '5 min ago' },
    { id: 'pastor1', name: 'Pastor David', status: 'online', lastSeen: 'now' },
    { id: 'user6', name: 'Jennifer Adams', status: 'online', lastSeen: 'now' },
    { id: 'user7', name: 'Mary Thompson', status: 'online', lastSeen: 'now' }
  ];

  const currentMessages = messages[selectedChannel] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    // TODO: Implement message sending via Meteor methods
    console.log('Sending message:', message, 'to channel:', selectedChannel);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastSeen = (timestamp) => {
    if (timestamp === 'now') return 'now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const addReaction = (messageId, emoji) => {
    // TODO: Implement reaction functionality
    console.log('Adding reaction:', emoji, 'to message:', messageId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the chat feature
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-warm-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-warm-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Community Chat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect with your community
          </p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Channels
            </h3>
            <div className="space-y-1">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                    selectedChannel === channel.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className="text-lg">#</span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{channel.name}</span>
                        {channel.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {channel.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {channel.memberCount}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div className="p-4 border-t border-warm-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Online ({onlineUsers.filter(u => u.status === 'online').length})
            </h3>
            <div className="space-y-2">
              {onlineUsers.map(user => (
                <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} border-2 border-white dark:border-gray-800 rounded-full`}></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatLastSeen(user.lastSeen)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-warm-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                #{channels.find(c => c.id === selectedChannel)?.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {channels.find(c => c.id === selectedChannel)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>👥</span>
              <span>{channels.find(c => c.id === selectedChannel)?.memberCount} members</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((msg, index) => {
            const isSystemMessage = msg.type === 'system';
            const showAvatar = index === 0 || currentMessages[index - 1].userId !== msg.userId;
            
            if (isSystemMessage) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex items-start space-x-3 group ${showAvatar ? 'mt-4' : 'mt-1'}`}>
                {showAvatar ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {msg.user.charAt(0)}
                  </div>
                ) : (
                  <div className="w-10 flex justify-center">
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {msg.user}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors duration-200">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {msg.message}
                    </p>
                    
                    {msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            onClick={() => addReaction(msg.id, reaction.emoji)}
                            className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-gray-600 dark:text-gray-400">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-warm-200 dark:border-gray-700 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name}`}
                  className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <span className="text-lg">➤</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center space-x-2">
              <button className="hover:text-gray-700 dark:hover:text-gray-300">😊</button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">📎</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
