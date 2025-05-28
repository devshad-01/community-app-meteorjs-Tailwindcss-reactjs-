import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  /**
   * Create a new user account
   * @param {Object} userData - The user data containing username, email, and password
   * @return {String} - Returns the new user ID if successful
   */
  'users.create'(userData) {
    check(userData, {
      username: String,
      email: String,
      password: String,
    });
    
    // Create the user account
    const userId = Accounts.createUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      profile: {
        firstName: '',
        lastName: '',
        bio: '',
        createdAt: new Date(),
      },
    });
    
    // If running on server, send verification email
    if (this.isSimulation !== true) {
      Accounts.sendVerificationEmail(userId);
    }
    
    return userId;
  },
  /**
   * Update user profile information
   * @param {Object} profileData - The profile data to update
   * @return {Boolean} - Returns true if successful
   */
  'users.updateProfile'(profileData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your profile');
    }

    check(profileData, {
      firstName: String,
      lastName: String,
      bio: Match.Maybe(String),
      // Add more fields as needed
    });

    return Meteor.users.update(this.userId, {
      $set: { 
        'profile.firstName': profileData.firstName,
        'profile.lastName': profileData.lastName,
        'profile.bio': profileData.bio || '',
        'profile.updatedAt': new Date(),
      },
    });
  },

  /**
   * Change user email
   * @param {String} newEmail - The new email address
   * @return {Boolean} - Returns true if successful
   */
  'users.changeEmail'(newEmail) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to change your email');
    }

    check(newEmail, String);

    const user = Meteor.users.findOne(this.userId);
    const oldEmail = user.emails && user.emails[0] && user.emails[0].address;
    
    if (oldEmail === newEmail) {
      throw new Meteor.Error('invalid-input', 'The new email is the same as the current email');
    }

    // Add the new email
    Accounts.addEmail(this.userId, newEmail, false);
    
    // Remove the old email if it exists
    if (oldEmail) {
      Accounts.removeEmail(this.userId, oldEmail);
    }
    
    // Send verification email for the new address
    Accounts.sendVerificationEmail(this.userId, newEmail);
    
    return true;
  },
});
