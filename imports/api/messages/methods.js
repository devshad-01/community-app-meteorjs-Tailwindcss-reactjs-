import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { MessagesCollection } from './index';

Meteor.methods({
  async 'messages.sendGeneral'(messageData) {
    console.log('Method called with:', messageData);
    
    // Basic validation
    if (!messageData || typeof messageData !== 'object') {
      throw new Meteor.Error('invalid-data', 'Invalid message data');
    }
    
    check(messageData, {
      content: String
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages');
    }

    const content = messageData.content?.trim();
    if (!content || content.length === 0) {
      throw new Meteor.Error('invalid-content', 'Message content cannot be empty');
    }

    if (content.length > 500) {
      throw new Meteor.Error('content-too-long', 'Message content cannot exceed 500 characters');
    }

    try {
      // Check rate limiting - max 10 messages per minute
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentMessagesCount = await MessagesCollection.find({
        userId: this.userId,
        type: 'general',
        createdAt: { $gte: oneMinuteAgo }
      }).countAsync();

      if (recentMessagesCount >= 10) {
        throw new Meteor.Error('rate-limit', 'Too many messages. Please wait before sending another message.');
      }

      const messageId = await MessagesCollection.insertAsync({
        content: content,
        userId: this.userId,
        type: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Message inserted with ID:', messageId);
      return messageId;
    } catch (error) {
      console.error('Error in messages.sendGeneral method:', error);
      throw error;
    }
  }
});