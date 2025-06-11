import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const AddEventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'social', // Default type
    date: '',      // YYYY-MM-DD
    time: '',      // HH:MM
    location: '',
    description: '',
    capacity: 0,
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false); // ADD: Prevent double submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) : value // Parse capacity to integer
    }));
  };

  const handleSubmit = async (e) => { // CHANGED: Make async
    e.preventDefault();
    
    // ADDED: Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }
    
    setIsSubmitting(true);
    setMessage(''); // Clear previous messages
    setMessageType('');

    // Client-side validation (basic)
    if (!formData.title || !formData.date || !formData.time || !formData.location || formData.capacity <= 0) {
      setMessage('Please fill in all required fields and ensure capacity is greater than 0.');
      setMessageType('error');
      setIsSubmitting(false); // ADDED: Reset submitting state
      return;
    }

    try {
      // CHANGED: Use async Meteor.callAsync instead of Meteor.call
      console.log('Submitting event data:', formData);
      const result = await Meteor.callAsync('events.insert', formData);
      
      console.log('Event created successfully:', result);
      setMessage('Event added successfully!');
      setMessageType('success');
      
      // Clear form fields after successful submission
      setFormData({
        title: '',
        type: 'social',
        date: '',
        time: '',
        location: '',
        description: '',
        capacity: 0,
      });
      
    } catch (error) {
      console.error('Error adding event:', error);
      setMessage(`Error adding event: ${error.error || error.reason || error.message}`);
      setMessageType('error');
    } finally {
      setIsSubmitting(false); // ADDED: Always reset submitting state
    }
  };

  return (
    <div className="  max-w-xl mx-auto p-5 bg-slate-800 rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Add New Event</h2>

      {message && (
        <div className={`p-3 mb-4 rounded-md ${messageType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium  mb-1">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-100 text-slate-900 border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={isSubmitting} // ADDED: Disable during submission
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium  mb-1">Event Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-100 text-slate-900  border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting} // ADDED: Disable during submission
          >
            <option value="workshop">Workshop</option>
            <option value="meeting">Meeting</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium  mb-1">Date (YYYY-MM-DD)</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={isSubmitting} // ADDED: Disable during submission
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium  mb-1">Time (HH:MM)</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={isSubmitting} // ADDED: Disable during submission
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium   mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-100 text-slate-900 border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={isSubmitting} // ADDED: Disable during submission
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 text-slate-900 py-2 bg-slate-100 border border-slate-600 rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting} // ADDED: Disable during submission
          ></textarea>
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium  mb-1">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={isSubmitting} // ADDED: Disable during submission
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting} // ADDED: Disable during submission
          className={`w-full font-bold py-2 px-4 rounded-md transition-colors ${
            isSubmitting 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white`}
        >
          {isSubmitting ? 'Adding Event...' : 'Add Event'} {/* ADDED: Show loading state */}
        </button>
      </form>
    </div>
  );
};