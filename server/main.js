import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import '/imports/api/users'; // Import users API (includes accounts, publications, methods)
import '../imports/api/events/events.js';         // Your Events collection
import '../imports/api/events/server/publications.js'; // Your Events publications
import '../imports/api/events/methods.js';         // Your Events methods
import '../imports/api/rsvps/rsvps.js';          // <--- ADD THIS LINE: Your new UserRsvps collection
import '../imports/api/rsvps/server/publications.js';
import { Roles } from 'meteor/alanning:roles';

console.log('TRACE: Roles object before Meteor.startup:', Roles);

Meteor.startup(async () => {
  console.log('Server started');
  console.log('TRACE: Roles object inside Meteor.startup:', Roles);
});