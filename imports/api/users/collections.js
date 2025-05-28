import { Meteor } from 'meteor/meteor';

// We don't need to create a new collection for users since Meteor already provides
// the built-in Meteor.users collection for storing user documents
// This file is for any extensions or helpers we want to add to the users collection

// Add collection helpers or methods to Meteor.users if needed
// Example: 
// Meteor.users.helpers({
//   fullName() {
//     return `${this.profile.firstName} ${this.profile.lastName}`;
//   }
// });

// Export the Meteor.users collection if needed for imports elsewhere
export const Users = Meteor.users;
