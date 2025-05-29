import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import '/imports/api/users'; // Import users API (includes accounts, publications, methods)

Meteor.startup(async () => {
  console.log('Server started');
});
