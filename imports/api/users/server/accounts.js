import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles'; // <--- Also import Roles here if you use it in startup code


Meteor.startup(() => {
  // Configure accounts
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false,
    loginExpirationInDays: 30,
  });

  // Validate new users
  Accounts.validateNewUser((user) => {
    // Basic validation
    if (!user.emails || !user.emails[0] || !user.emails[0].address) {
      throw new Meteor.Error(403, 'Email is required');
    }
    
    if (!user.profile || !user.profile.name) {
      throw new Meteor.Error(403, 'Name is required');
    }

    return true;
  });

  // Set up user creation hooks
  Accounts.onCreateUser((options, user) => {
    // Set default profile
    user.profile = options.profile || {};
    
    // Set default role if not specified
    if (!user.profile.role) {
      user.profile.role = 'member';
    }
    
    // Add creation timestamp
    user.createdAt = new Date();
    
    return user;
  });

  // Configure email templates
  Accounts.emailTemplates.siteName = 'CommunityHub';
  Accounts.emailTemplates.from = 'CommunityHub <noreply@communityhub.com>';

  Accounts.emailTemplates.resetPassword = {
    subject() {
      return 'Reset your password on CommunityHub';
    },
    text(user, url) {
      return `Hello ${user.profile?.name || 'User'},\n\nTo reset your password, simply click the link below:\n\n${url}\n\nIf you did not request this reset, please ignore this email.\n\nThanks,\nThe CommunityHub Team`;
    }
  };

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return 'Verify your email address';
    },
    text(user, url) {
      return `Hello ${user.profile?.name || 'User'},\n\nTo verify your account email, simply click the link below:\n\n${url}\n\nThanks,\nThe CommunityHub Team`;
    }
  };

  // Create default admin user if it doesn't exist
  Meteor.users.find().countAsync().then((userCount) => {
    if (userCount === 0) {
      const adminUserId = Accounts.createUser({
        email: 'admin@communityhub.com',
        password: 'admin123',
        username: 'admin',
        profile: {
          name: 'System Administrator',
          role: 'admin'
        }
      });
      
      console.log('Created default admin user:', adminUserId);
    }
  }).catch((error) => {
    console.error('Error checking user count:', error);
  });
});
