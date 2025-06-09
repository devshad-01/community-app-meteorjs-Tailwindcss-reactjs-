import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';  // Correct import
SimpleSchema.debug = true; // <--- ADD THIS LINE
import 'meteor/aldeed:collection2/dynamic';
import { Roles } from 'meteor/alanning:roles'; // <--- Also import Roles here if you use it in startup code


export const Events = new Mongo.Collection('Events');

// Define schema
const EventsSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Event Title",
    max: 100
  },
  type: {
    type: String,
    label: "Event Type",
    allowedValues: ['workshop', 'meeting', 'social'],
    defaultValue: 'social'
  },
  date: {
    type: String,
    label: "Event Date",
    regEx: SimpleSchema.RegEx.Date
  },
  time: {
    type: String,
    label: "Event Time",
    regEx: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  },
  location: {
    type: String,
    label: "Event Location",
    max: 200
  },
  description: {
    type: String,
    label: "Event Description",
    max: 1000,
    optional: true
  },
  capacity: {
    type: Number,
    label: "Event Capacity",
    min: 0
  },
  registered: {
    type: Number,
    label: "Registered Attendees",
    min: 0,
    defaultValue: 0
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
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

// Attach schema using the imported function
Collection2.load(Events, EventsSchema);