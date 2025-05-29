import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'users.updateProfile'(profileData) {
    check(profileData, {
      name: String,
      // Add other profile fields as needed
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in to update profile');
    }

    return Meteor.users.update(this.userId, {
      $set: {
        'profile.name': profileData.name,
      }
    });
  },

  'users.updateRole'(userId, role) {
    check(userId, String);
    check(role, Match.OneOf('member', 'admin'));

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in');
    }

    const currentUser = Meteor.users.findOne(this.userId);
    if (!currentUser || currentUser.profile?.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Must be admin to change user roles');
    }

    return Meteor.users.update(userId, {
      $set: {
        'profile.role': role,
      }
    });
  },

  'users.deleteUser'(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Must be logged in');
    }

    const currentUser = Meteor.users.findOne(this.userId);
    if (!currentUser || currentUser.profile?.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Must be admin to delete users');
    }

    // Don't allow admin to delete themselves
    if (userId === this.userId) {
      throw new Meteor.Error('not-allowed', 'Cannot delete your own account');
    }

    return Meteor.users.remove(userId);
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
  }
});
