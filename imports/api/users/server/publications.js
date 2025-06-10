import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Publish current user's full profile
Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          emails: 1,
          username: 1,
          profile: 1,
          createdAt: 1,
          services: 1 // Include services for social login info
        }
      }
    );
  } else {
    this.ready();
  }
});

// Publish user list for admins
Meteor.publish('allUsers', function () {
  const user = Meteor.users.findOneAsync(this.userId);
  
  if (user && user.profile && user.profile.role === 'admin') {
    return Meteor.users.find(
      {},
      {
        fields: {
          emails: 1,
          username: 1,
          profile: 1,
          createdAt: 1,
          'services.facebook.name': 1,
          'services.google.name': 1,
          'services.github.username': 1
        }
      }
    );
  } else {
    this.ready();
  }
});

// Publish basic user info for all authenticated users (for mentions, etc.)
Meteor.publish('usersBasic', function () {
  if (this.userId) {
    return Meteor.users.find(
      {},
      {
        fields: {
          username: 1,
          'profile.name': 1,
          'profile.role': 1,
          'profile.avatar': 1  // Added avatar field for UserAvatar component
        }
      }
    );
  } else {
    this.ready();
  }
});
