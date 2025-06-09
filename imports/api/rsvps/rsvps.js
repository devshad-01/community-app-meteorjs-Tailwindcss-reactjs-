import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';  // Correct import
import 'meteor/aldeed:collection2/dynamic';

// Create the MongoDB Collection for User RSVPs
export const UserRsvps = new Mongo.Collection('userRsvps');

// Define the schema for the UserRsvps collection
UserRsvps.schema = new SimpleSchema({
  eventId: {
    type: String,
    label: "Event ID",
    // You could add a custom validator here to ensure the eventId exists in Events collection
  },
  userId: {
    type: String,
    label: "User ID",
    regEx: SimpleSchema.RegEx.Id, // Ensures it's a valid MongoDB _id format
  },
  status: {
    type: String,
    label: "RSVP Status",
    allowedValues: ['pending_payment', 'confirmed', 'cancelled'],
    defaultValue: 'pending_payment', // Default for new RSVPs awaiting payment
  },
  paymentId: {
    type: String,
    label: "Associated Payment ID",
    optional: true, // Only present after payment is initiated/confirmed
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    type: Date,
    label: "Updated At",
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

// Attach the schema to the collection
Collection2.load(UserRsvps.schema);