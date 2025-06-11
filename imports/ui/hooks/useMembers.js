import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useState, useEffect } from 'react';
import { MessagesCollection } from '../../api/messages';

export const useMembers = (options = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [limit, setLimit] = useState(20);

  const {
    members,
    loading,
    user,
    conversations
  } = useTracker(() => {
    const user = Meteor.user();
    
    // Subscribe to members list
    const membersHandle = Meteor.subscribe('membersList', {
      search: searchTerm,
      limit: limit,
      ...options
    });

    // Subscribe to user conversations
    const conversationsHandle = Meteor.subscribe('userConversations');

    const loading = !membersHandle.ready() || !conversationsHandle.ready();

    // Get members
    let membersSelector = {};
    
    // Apply filters
    if (selectedFilter === 'online') {
      membersSelector['status.online'] = true;
    } else if (selectedFilter === 'admins') {
      membersSelector['profile.role'] = 'admin';
    }

    const members = Meteor.users.find(membersSelector, {
      sort: { 
        'status.online': -1,
        'status.lastActivity': -1,
        createdAt: -1 
      }
    }).fetch().filter(member => member._id !== user?._id);

    // Get conversations data
    const allDirectMessages = MessagesCollection.find({
      type: 'direct',
      $or: [
        { senderId: user?._id },
        { recipientId: user?._id }
      ]
    }, { sort: { createdAt: -1 } }).fetch();

    // Build conversations map
    const conversationsMap = new Map();
    allDirectMessages.forEach(msg => {
      const otherUserId = msg.senderId === user?._id ? msg.recipientId : msg.senderId;
      if (!conversationsMap.has(otherUserId)) {
        const unreadCount = allDirectMessages.filter(m => 
          m.senderId === otherUserId && 
          m.recipientId === user?._id && 
          !m.read
        ).length;
        
        conversationsMap.set(otherUserId, {
          lastMessage: msg,
          unreadCount
        });
      }
    });

    return {
      user,
      members,
      loading,
      conversations: conversationsMap
    };
  }, [searchTerm, selectedFilter, limit, options]);

  return {
    members,
    loading,
    user,
    conversations,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    limit,
    setLimit
  };
};
