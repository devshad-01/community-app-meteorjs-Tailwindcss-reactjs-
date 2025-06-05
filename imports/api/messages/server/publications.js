import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { MessagesCollection } from '../index';

Meteor.publish('generalChatMessages', function(options = {}) {
  check(options, {
    limit: Match.Optional(Number)
  });

  if (!this.userId) {
    return this.ready();
  }

  const limit = Math.min(options.limit || 50, 100); // Cap at 100 messages

  return MessagesCollection.find(
    { type: 'general' },
    {
      sort: { createdAt: -1 },
      limit,
      fields: {
        content: 1,
        userId: 1,
        type: 1,
        createdAt: 1,
        reactions: 1,
        updatedAt: 1
      }
    }
  );
});