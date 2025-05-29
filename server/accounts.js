import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  // Configure accounts
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false,
    loginExpirationInDays: 30,
  });

  // Validate new users
  Accounts.validateNewUser((user) => {
    if (!user.emails || !user.emails[0]?.address) {
      throw new Meteor.Error(403, 'Email is required');
    }

    if (!user.profile || !user.profile.name) {
      throw new Meteor.Error(403, 'Name is required');
    }

    return true;
  });

  // Hook for customizing user creation
  Accounts.onCreateUser((options, user) => {
    user.profile = options.profile || {};

    if (!user.profile.role) {
      user.profile.role = 'member';
    }

    user.createdAt = new Date();

    return user;
  });

  // Email templates
  Accounts.emailTemplates.siteName = 'CommunityHub';
  Accounts.emailTemplates.from = 'CommunityHub <noreply@communityhub.com>';

  Accounts.emailTemplates.resetPassword = {
    subject() {
      return 'Reset your password on CommunityHub';
    },
    text(user, url) {
      return `Hello ${user.profile?.name || 'User'},\n\nTo reset your password, click the link below:\n\n${url}\n\nIf you did not request this, ignore this email.\n\nThanks,\nCommunityHub Team`;
    }
  };

  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return 'Verify your email address';
    },
    text(user, url) {
      return `Hello ${user.profile?.name || 'User'},\n\nTo verify your email, click the link below:\n\n${url}\n\nThanks,\nCommunityHub Team`;
    }
  };

  // Create default admin user only if not present
  if (Meteor.users.find().count() === 0) {
    const userId = Accounts.createUser({
      email: 'admin@communityhub.com',
      username: 'admin',
      password: 'admin123',
      profile: {
        name: 'System Administrator',
        role: 'admin'
      }
    });

    console.log('✅ Created default admin user with ID:', userId);
  }
});

