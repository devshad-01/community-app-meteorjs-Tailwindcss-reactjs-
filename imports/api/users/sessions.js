import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// NOTE: The konecty:user-presence package has been removed.
// This file is kept for future reference in case we implement our own user session tracking.

// Create a basic UsersSessions collection for potential future use
export const UsersSessions = new Mongo.Collection('usersSessions');

// Add basic index for user ID
if (Meteor.isServer) {
  Meteor.startup(() => {
    // Create a simple index for user lookups
    UsersSessions.createIndex({ userId: 1 });
    
    console.log('Basic UsersSessions index has been created');
  });
}
