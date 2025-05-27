// Users collection and methods will be defined here
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// Note: In Meteor, the users collection is already defined as Meteor.users
// We're exporting it here for consistency in our app's architecture
export const Users = Meteor.users;

// Import sessions to make sure it's loaded
import './sessions';
