// Users API - Main entry point
import { Meteor } from 'meteor/meteor';

// Import server-side code when on server
if (Meteor.isServer) {
  import './server';
}

// Export the users collection (Meteor.users is the built-in collection)
export const UsersCollection = Meteor.users;

// Export method names for client use
export const UserMethods = {
  updateProfile: 'users.updateProfile',
  updateUsername: 'users.updateUsername',
  updateRole: 'users.updateRole',
  deleteUser: 'users.deleteUser',
  sendVerificationEmail: 'users.sendVerificationEmail',
  sendPasswordResetEmail: 'users.sendPasswordResetEmail'
};

// Export publication names for client use
export const UserPublications = {
  userData: 'userData',
  allUsers: 'allUsers',
  usersBasic: 'usersBasic'
};
