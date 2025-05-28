// Server startup code
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Import user-related modules directly without using index.js
import '../../api/users/publications';
import '../../api/users/methods';

// Initialize server-specific code here
Meteor.startup(() => {
  console.log('Server application started');
  
  // Configure accounts
  Accounts.config({
    sendVerificationEmail: true,
  });
  
  // Set email templates
  Accounts.emailTemplates.siteName = "Your App Name";
  Accounts.emailTemplates.from = "Your App <no-reply@yourdomain.com>";
});
