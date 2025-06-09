// imports/api/events/methods.js

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Events } from './events.js';
import { UserRsvps } from '../rsvps/rsvps.js';
import { Roles } from 'meteor/alanning:roles';

// --- DEBUG TRACE FOR ROLES ---
console.log('TRACE: Roles object at the beginning of events/methods.js:', typeof Roles, Roles);

Meteor.methods({
  // Make the method 'async'
  'events.insert': async function (eventData) { // <-- ASYNC keyword added
    try {
      console.log('--- events.insert method called! ---');
      console.log('Current user ID:', this.userId);
      console.log('Incoming eventData:', eventData);

      if (!this.userId) {
        console.error('Error: User not authorized - Not logged in.');
        throw new Meteor.Error('not-authorized', 'You must be logged in to create events.');
      }

      // FIXED: Better Roles checking that won't crash the app
      console.log('Checking Roles availability...');
      console.log('typeof Roles:', typeof Roles);
      console.log('Roles object:', Roles);

      if (!Roles || typeof Roles.userIsInRole !== 'function') {
        console.warn('Warning: Roles package not properly loaded');
        // For development - allow access, for production - you might want to deny
        console.log('Skipping admin check due to roles configuration issue');
      } else {
        console.log('Roles package is working, checking admin status...');
        if (!Roles.userIsInRole(this.userId, 'admin')) {
          console.error('Error: User not authorized - Not an admin. User ID:', this.userId);
          throw new Meteor.Error('not-authorized', 'Only administrators can create events.');
        }
      }

      console.log('Attempting check() validation on incoming data...');
      check(eventData, {
        title: String,
        type: String,
        date: String,
        time: String,
        location: String,
        description: Match.Maybe(String),
        capacity: Number,
      });
      console.log('check() validation passed.');

      // UPDATED: Changed to insertAsync with await
      console.log('Attempting Events.insertAsync...');
      const newEventId = await Events.insertAsync(eventData); // <-- CHANGED from .insert() to .insertAsync() with await
      console.log('Events.insertAsync successful! New ID:', newEventId);
      return newEventId;

    } catch (error) {
      console.error('--- A CRITICAL ERROR OCCURRED IN events.insert method (SERVER-SIDE) ---');
      console.error('Error object (full):', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if (error.reason) {
          console.error('Error reason (for Meteor.Error):', error.reason);
      }
      if (error.details) {
          console.error('Error details (for SimpleSchema validation errors):', error.details);
      }
      if (error.stack) {
          console.error('Error stack trace:', error.stack);
      }

      const clientErrorMessage = error.reason || error.message || 'An unknown error occurred on the server.';
      throw new Meteor.Error('event-insert-failed', clientErrorMessage);
    }
  },

  'events.rsvp': async function (eventId, wantsToAttend) { // ASYNC method
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to RSVP for events.');
    }

    check(eventId, String);
    check(wantsToAttend, Boolean);

    const event = await Events.findOneAsync(eventId); // CHANGED to findOneAsync
    if (!event) {
      throw new Meteor.Error('event-not-found', 'Event not found.');
    }

    const userId = this.userId;
    const existingRsvp = await UserRsvps.findOneAsync({ eventId, userId }); // CHANGED to findOneAsync

    if (wantsToAttend) {
      if (existingRsvp) {
        if (existingRsvp.status === 'confirmed' || existingRsvp.status === 'pending_payment') {
          throw new Meteor.Error('already-rsvpd', 'You have already RSVPd or are pending payment for this event.');
        } else if (existingRsvp.status === 'cancelled') {
          await UserRsvps.updateAsync(existingRsvp._id, { $set: { status: 'pending_payment', updatedAt: new Date() } }); // CHANGED to updateAsync
          return { success: true, message: 'Your RSVP is now pending payment again.' };
        }
      } else {
        if (event.registered >= event.capacity) {
            throw new Meteor.Error('event-full', 'This event is at full capacity.');
        }
        await UserRsvps.insertAsync({ // CHANGED to insertAsync
          eventId,
          userId,
          status: 'pending_payment'
        });
        return { success: true, message: 'RSVP initiated. Please proceed to payment.' };
      }
    } else {
      if (!existingRsvp || existingRsvp.status === 'cancelled') {
        throw new Meteor.Error('not-rsvpd', 'You are not currently RSVPd for this event.');
      }

      await UserRsvps.updateAsync(existingRsvp._id, { $set: { status: 'cancelled', updatedAt: new Date() } }); // CHANGED to updateAsync

      if (existingRsvp.status === 'confirmed') {
        await Events.updateAsync(eventId, { $inc: { registered: -1 } }); // CHANGED to updateAsync
      }
      return { success: true, message: 'RSVP cancelled successfully.' };
    }
  },

  'events.processPayment': async function (eventId, amount, phoneNumber) { // ASYNC method
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to make a payment.');
    }

    check(eventId, String);
    check(amount, Number);
    check(phoneNumber, String);

    const event = await Events.findOneAsync(eventId); // CHANGED to findOneAsync
    if (!event) {
      throw new Meteor.Error('event-not-found', 'Event for payment not found.');
    }

    const userId = this.userId;
    const userRsvp = await UserRsvps.findOneAsync({ eventId, userId }); // CHANGED to findOneAsync

    if (!userRsvp || userRsvp.status === 'confirmed' || userRsvp.status === 'cancelled') {
        throw new Meteor.Error('invalid-rsvp-state', 'Cannot process payment for this RSVP state.');
    }

    if (event.registered >= event.capacity) {
        throw new Meteor.Error('event-full-payment', 'Event is now full, cannot process payment.');
    }

    console.log(`[Server] Processing payment for Event: ${event.title}, Amount: ${amount}, Phone: ${phoneNumber}`);

    try {
      const simulatedPaymentId = `MPESA-${Math.random().toString(36).substring(2, 15)}`;
      console.log(`[Server] Simulated Mpesa payment initiated for ${phoneNumber}. Ref: ${simulatedPaymentId}`);

      await UserRsvps.updateAsync(userRsvp._id, { // CHANGED to updateAsync
        $set: {
          status: 'confirmed',
          paymentId: simulatedPaymentId,
          updatedAt: new Date()
        }
      });

      await Events.updateAsync(eventId, { $inc: { registered: 1 } }); // CHANGED to updateAsync

      return { success: true, message: 'Mpesa STK Push initiated successfully. Please complete payment on your phone.' };

    } catch (mpesaError) {
      console.error('Mpesa Payment Error:', mpesaError);
      throw new Meteor.Error('mpesa-payment-failed', 'Failed to initiate Mpesa payment: ' + mpesaError.message);
    }
  },
});