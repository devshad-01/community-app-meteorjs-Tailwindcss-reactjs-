// Client startup code
import { Meteor } from 'meteor/meteor';

// Import client-side API modules
import '../../api/notifications';

// Initialize client-specific code here
Meteor.startup(() => {
  console.log('Client application started');
});
