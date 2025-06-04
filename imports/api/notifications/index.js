// Notifications collection and methods will be defined here
import { Mongo } from 'meteor/mongo';

export const NotificationsCollection = new Mongo.Collection('notifications');

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_POST: 'new_post',
  NEW_MESSAGE: 'new_message',
  NEW_REPLY: 'new_reply',
  POST_LIKED: 'post_liked',
  MENTION: 'mention'
};

// Import methods to make them available
import './methods';
