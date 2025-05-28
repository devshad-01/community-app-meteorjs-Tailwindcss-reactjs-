import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

/**
 * Publish the current user's data with additional fields
 * By default, Meteor only publishes username, emails, and profile to the client
 */
Meteor.publish('users.current', function () {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find(
    { _id: this.userId },
    { 
      fields: { 
        username: 1,
        emails: 1,
        profile: 1,
        // Add any additional fields you want to publish for the current user
        createdAt: 1,
      } 
    }
  );
});

/**
 * Publish public user data for a specific user
 * This is useful for viewing other user profiles
 */
Meteor.publish('users.single', function (userId) {
  check(userId, String);
  
  return Meteor.users.find(
    { _id: userId },
    { 
      fields: { 
        username: 1,
        'profile.firstName': 1,
        'profile.lastName': 1,
        'profile.bio': 1,
        // Only include public fields here
      } 
    }
  );
});

/**
 * Publish a list of users with limited fields
 * Useful for user directories, member lists, etc.
 */
Meteor.publish('users.directory', function (limit = 10, skip = 0) {
  check(limit, Number);
  check(skip, Number);

  // You can add filters here if needed
  return Meteor.users.find(
    {}, 
    {
      fields: {
        username: 1,
        'profile.firstName': 1,
        'profile.lastName': 1,
      },
      sort: { 'profile.lastName': 1, 'profile.firstName': 1 },
      limit: limit,
      skip: skip,
    }
  );
});
