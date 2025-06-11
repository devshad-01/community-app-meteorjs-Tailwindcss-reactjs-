// imports/api/events/methods.js

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Events } from './events.js';
import { UserRsvps } from '../rsvps/rsvps.js';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  'events.insert': async function (eventData) { 
    try {
      
      if (!this.userId) {
        console.error('Error: User not authorized - Not logged in.');
        throw new Meteor.Error('not-authorized', 'You must be logged in to create events.');
      }

      if (!Roles || typeof Roles.userIsInRole !== 'function') {
        console.warn('Warning: Roles package not properly loaded');
        // For development - allow access, for production - you might want to deny
      } else {
        if (!Roles.userIsInRole(this.userId, 'admin')) {
          console.error('Error: User not authorized - Not an admin. User ID:', this.userId);
          throw new Meteor.Error('not-authorized', 'Only administrators can create events.');
        }
      }

      check(eventData, {
        title: String,
        type: String,
        date: String,
        time: String,
        location: String,
        description: Match.Maybe(String),
        capacity: Number,
      });
      // console.log('check() validation passed.'); // Removed for cleaner console

      // UPDATED: Changed to insertAsync with await
      // console.log('Attempting Events.insertAsync...'); // Removed for cleaner console
      const newEventId = await Events.insertAsync(eventData); // <-- CHANGED from .insert() to .insertAsync() with await
      // console.log('Events.insertAsync successful! New ID:', newEventId); // Removed for cleaner console
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
    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to make a payment.');
    }

    check(eventId, String);
    check(amount, Number);
    check(phoneNumber, String);

    const event = Events.findOne(eventId); // No change here, use findOne since it's on the server
    if (!event) {
      throw new Meteor.Error('event-not-found', 'Event for payment not found.');
    }

    const userId = this.userId;
    const userRsvp = UserRsvps.findOne({ eventId, userId }); // No change here, use findOne since it's on the server

    if (!userRsvp || userRsvp.status === 'confirmed' || userRsvp.status === 'cancelled') {
        throw new Meteor.Error('invalid-rsvp-state', 'Cannot process payment for this RSVP state.');
    }

    if (event.registered >= event.capacity) {
        throw new Meteor.Error('event-full-payment', 'Event is now full, cannot process payment.');
    }

    // console.log(`[Server] Processing payment for Event: ${event.title}, Amount: ${amount}, Phone: ${phoneNumber}`); // Removed for cleaner console

    try {
        // --- Mpesa Integration Logic (from previous instructions) ---
        const mpesaSettings = Meteor.settings.private.mpesa;
        if (!mpesaSettings) {
          throw new Meteor.Error('mpesa-config-missing', 'Mpesa API configuration is missing on the server.');
        }

        const { consumerKey, consumerSecret, shortcode, passkey, callbackUrl } = mpesaSettings;

        if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
          throw new Meteor.Error('mpesa-config-incomplete', 'Incomplete Mpesa API configuration. Check settings.json.');
        }

        // Generate Auth Token (Bearer Token)
        const consumerAuth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        let accessToken;
        try {
          const tokenResponse = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { 'Authorization': `Basic ${consumerAuth}` } }
          );
          accessToken = tokenResponse.data.access_token;
          // console.log('Mpesa Access Token generated successfully.'); // Removed for cleaner console
        } catch (error) {
          console.error('Error generating Mpesa Access Token:', error.response ? error.response.data : error.message);
          throw new Meteor.Error('mpesa-auth-failed', 'Failed to authenticate with Mpesa API.');
        }

        // Prepare STK Push Request Data
        const timestamp = moment().format('YYYYMMDDHHmmss');
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const transactionDesc = `Payment for Event: ${event.title}`;
        const accountRef = `${eventId}-${this.userId}-${new Date().getTime()}`;

        const stkPushPayload = {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: accountRef,
          TransactionDesc: transactionDesc
        };

        // Make STK Push Request
        // console.log('Sending STK Push to Mpesa...'); // Removed for cleaner console
        const stkResponse = await axios.post(
          'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
          stkPushPayload,
          { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );

        const responseData = stkResponse.data;
        // console.log('Mpesa STK Push Response:', responseData); // Removed for cleaner console

        if (responseData.ResponseCode === '0') {
          await UserRsvps.updateAsync(userRsvp._id, {
            $set: { status: 'pending_payment', merchantRequestId: responseData.MerchantRequestID, checkoutRequestId: responseData.CheckoutRequestID, updatedAt: new Date() }
          });
          return { success: true, message: 'Mpesa STK Push initiated. Please check your phone to complete payment.' };
        } else {
          console.error('STK Push Initiation Error:', responseData.ResponseCode, responseData.ResponseDescription, responseData.ErrorMessage);
          throw new Meteor.Error('stk-push-init-failed', responseData.ResponseDescription || responseData.ErrorMessage || 'Failed to initiate Mpesa STK Push.');
        }
        // --- End Mpesa Integration Logic ---

    } catch (error) {
      console.error('Mpesa Payment Error:', error);
      // More detailed error logging for debugging
      if (error.response && error.response.data) {
          console.error("Mpesa API Error Details:", error.response.data);
      }
      throw new Meteor.Error('mpesa-payment-failed', 'Failed to initiate Mpesa payment: ' + (error.response?.data?.errorMessage || error.message));
    }
  },
});