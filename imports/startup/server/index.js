// Server startup code
import { Meteor } from 'meteor/meteor';

// Import API modules
import '../../api/users/server';
import '../../api/forums';
import '../../api/messages/server';
import '../../api/notifications/server';

// Initialize server-specific code here
Meteor.startup(() => {
  console.log('Server application started');
});
