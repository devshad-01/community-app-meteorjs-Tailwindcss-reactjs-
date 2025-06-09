// imports/api/events/server/publications.js

import { Meteor } from 'meteor/meteor';
import { Events } from '../events.js';
import { UserRsvps } from '/imports/api/rsvps/rsvps.js';

if (Meteor.isServer) {
  /**
   * MODIFIED: Publishes ALL events to the client.
   * The client will now handle categorizing these into upcoming/past.
   */
  Meteor.publish('events.all', function() {
    console.log('Publishing all events...');
    // Sort events by date and time for consistent order on the client
    return Events.find({}, { sort: { date: 1, time: 1 } });
  });

  // Your existing UserRsvps publication remains unchanged
  Meteor.publish('rsvps.myEvents', function() {
    if (!this.userId) {
      return this.ready();
    }
    console.log(`Publishing RSVPs for user: ${this.userId}`);
    return UserRsvps.find({ userId: this.userId });
  });

  // REMOVED: No longer need 'events.upcoming' and 'events.past' publications
}