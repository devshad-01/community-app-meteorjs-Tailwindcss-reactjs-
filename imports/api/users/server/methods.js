import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  async 'users.updateProfile'(profileData) {
    // Simple validation - just check it's an object
    if (!profileData || typeof profileData !== 'object') {
      throw new Meteor.Error('invalid-data', 'Profile data must be an object');
    }

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in to update profile');
    }

    // Build update fields safely - handle null/undefined values properly
    const updateFields = {};
    
    if (profileData.name !== undefined && profileData.name !== null && typeof profileData.name === 'string') {
      updateFields['profile.name'] = profileData.name;
    }
    if (profileData.avatar !== undefined && profileData.avatar !== null && typeof profileData.avatar === 'string') {
      updateFields['profile.avatar'] = profileData.avatar;
    }
    if (profileData.bio !== undefined && profileData.bio !== null && typeof profileData.bio === 'string') {
      updateFields['profile.bio'] = profileData.bio;
    }
    if (profileData.location !== undefined && profileData.location !== null && typeof profileData.location === 'string') {
      updateFields['profile.location'] = profileData.location;
    }
    if (profileData.website !== undefined && profileData.website !== null && typeof profileData.website === 'string') {
      updateFields['profile.website'] = profileData.website;
    }

    return await Meteor.users.updateAsync(this.userId, {
      $set: updateFields
    });
  },

  async 'users.updateUsername'(newUsername) {
    check(newUsername, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in to update username');
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(newUsername)) {
      throw new Meteor.Error('invalid-username', 'Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores');
    }

    // Check if username is already taken
    const existingUser = await Meteor.users.findOneAsync({ username: newUsername });
    if (existingUser && existingUser._id !== this.userId) {
      throw new Meteor.Error('username-taken', 'Username is already taken');
    }

    return Accounts.setUsername(this.userId, newUsername);
  },

  async 'users.updateRole'(userId, role) {
    check(userId, String);
    check(role, Match.OneOf('member', 'admin'));

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in');
    }

    const currentUser = await Meteor.users.findOneAsync(this.userId);
    if (!currentUser || currentUser.profile?.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Must be admin to change user roles');
    }

    return await Meteor.users.updateAsync(userId, {
      $set: {
        'profile.role': role,
      }
    });
  },

  async 'users.deleteUser'(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in');
    }

    const currentUser = await Meteor.users.findOneAsync(this.userId);
    if (!currentUser || currentUser.profile?.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Must be admin to delete users');
    }

    // Don't allow admin to delete themselves
    if (userId === this.userId) {
      throw new Meteor.Error('not-allowed', 'Cannot delete your own account');
    }

    return await Meteor.users.removeAsync(userId);
  },

  async 'users.sendVerificationEmail'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in');
    }

    return await Accounts.sendVerificationEmail(this.userId);
  },

  async 'users.sendPasswordResetEmail'(email) {
    check(email, String);

    const user = await Meteor.users.findOneAsync({
      'emails.address': email
    });

    if (!user) {
      throw new Meteor.Error('not-found', 'No user found with that email address');
    }

    return await Accounts.sendResetPasswordEmail(user._id);
  },

  async 'users.updatePresence'(isOnline) {
    check(isOnline, Boolean);
    
    if (!this.userId) {
      return; // Don't throw error, just return
    }

    const updateFields = {
      'status.lastActivity': new Date()
    };

    if (isOnline) {
      updateFields['status.online'] = true;
    } else {
      updateFields['status.online'] = false;
    }

    try {
      await Meteor.users.updateAsync(this.userId, {
        $set: updateFields
      });
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  }
});
