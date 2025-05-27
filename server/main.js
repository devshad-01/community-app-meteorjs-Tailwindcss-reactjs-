import { Meteor } from 'meteor/meteor';

// Import collections first to ensure they're defined
import '/imports/api/users/sessions';
import '/imports/api/users/index';
import '/imports/api/events/index';
import '/imports/api/forums/index';
import '/imports/api/messages/index';
import '/imports/api/threads/index';
import '/imports/api/notifications/index';

// Then import startup code
import '/imports/startup/server';

Meteor.startup(async () => {
  console.log('Server started - Community App');
});
