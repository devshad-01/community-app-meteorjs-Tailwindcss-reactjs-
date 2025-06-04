import { Meteor } from 'meteor/meteor';
import { NOTIFICATION_TYPES } from './index';

// Helper functions to create notifications
export const NotificationHelpers = {
  async createForNewPost(postId, postTitle, authorId, categoryId) {
    if (!Meteor.isServer) return;

    // Get all users who might be interested (for now, all active users)
    // In the future, you could add user preferences or category subscriptions
    const users = await Meteor.users.find({
      _id: { $ne: authorId }, // Don't notify the author
      'status.online': true // Only notify online users
    }, {
      fields: { _id: 1 },
      limit: 50 // Limit to prevent spam
    }).fetchAsync();

    const notifications = users.map(user => ({
      userId: user._id,
      type: NOTIFICATION_TYPES.NEW_POST,
      title: 'New Post Created',
      message: `"${postTitle}" was posted in the forum`,
      relatedId: postId,
      relatedType: 'post',
      fromUserId: authorId
    }));

    // Create notifications in batch
    for (const notification of notifications) {
      try {
        await Meteor.callAsync('notifications.create', notification);
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }
  },

  async createForNewMessage(messageId, messageContent, authorId) {
    if (!Meteor.isServer) return;

    // For chat messages, we'll only create notifications for mentions
    // to avoid spam - regular chat notifications should be handled differently
    // or be optional based on user preferences
    
    // Note: The mention detection will handle @mentions in chat
    console.log('Skipping general chat notifications to avoid spam');
  },

  async createForNewReply(replyId, postId, replyContent, authorId, postAuthorId) {
    if (!Meteor.isServer) return;

    // Notify the original post author
    if (postAuthorId && postAuthorId !== authorId) {
      const truncatedContent = replyContent.length > 50 
        ? replyContent.substring(0, 50) + '...' 
        : replyContent;

      try {
        await Meteor.callAsync('notifications.create', {
          userId: postAuthorId,
          type: NOTIFICATION_TYPES.NEW_REPLY,
          title: 'New Reply to Your Post',
          message: `Someone replied: "${truncatedContent}"`,
          relatedId: postId,
          relatedType: 'post',
          fromUserId: authorId
        });
      } catch (error) {
        console.error('Error creating reply notification:', error);
      }
    }
  },

  async createForPostLike(postId, postTitle, likedUserId, postAuthorId) {
    if (!Meteor.isServer) return;

    // Notify the post author
    if (postAuthorId && postAuthorId !== likedUserId) {
      try {
        await Meteor.callAsync('notifications.create', {
          userId: postAuthorId,
          type: NOTIFICATION_TYPES.POST_LIKED,
          title: 'Your Post Was Liked',
          message: `Someone liked your post: "${postTitle}"`,
          relatedId: postId,
          relatedType: 'post',
          fromUserId: likedUserId
        });
      } catch (error) {
        console.error('Error creating like notification:', error);
      }
    }
  },

  // Create mention notification
  async createForMention(mentionedUserId, fromUserId, contentType, relatedId, title, content) {
    if (!mentionedUserId || !fromUserId) return;
    
    try {
      const fromUser = await Meteor.users.findOneAsync(fromUserId, {
        fields: { 'profile.name': 1, username: 1 }
      });
      
      const fromUserName = fromUser?.profile?.name || fromUser?.username || 'Someone';
      
      let notificationTitle = title;
      let notificationMessage = content;
      
      // Customize notification based on content type
      switch (contentType) {
        case 'post':
          notificationTitle = `${fromUserName} mentioned you in a post`;
          notificationMessage = `"${title}"`;
          break;
        case 'reply':  
          notificationTitle = `${fromUserName} mentioned you in a reply`;
          notificationMessage = content.substring(0, 100) + (content.length > 100 ? '...' : '');
          break;
        case 'message':
          notificationTitle = `${fromUserName} mentioned you in chat`;
          notificationMessage = content.substring(0, 100) + (content.length > 100 ? '...' : '');
          break;
      }
      
      return await Meteor.callAsync('notifications.create', {
        userId: mentionedUserId,
        type: NOTIFICATION_TYPES.MENTION,
        title: notificationTitle,
        message: notificationMessage,
        relatedId: relatedId,
        relatedType: contentType,
        fromUserId: fromUserId,
        data: {
          contentType,
          content: content.substring(0, 200) // Store truncated content
        }
      });
    } catch (error) {
      console.error('Error creating mention notification:', error);
    }
  },

  // Helper to detect mentions in text
  detectMentions(text) {
    if (!text) return [];
    
    // Match @username patterns (alphanumeric and underscores)
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]); // The username without @
    }
    
    return [...new Set(mentions)]; // Remove duplicates
  },

  // Helper to find users by username for mentions
  async findUsersByUsernames(usernames) {
    if (!usernames || usernames.length === 0) return [];
    
    return await Meteor.users.find({
      username: { $in: usernames }
    }, {
      fields: { _id: 1, username: 1, 'profile.name': 1 }
    }).fetchAsync();
  }
};
