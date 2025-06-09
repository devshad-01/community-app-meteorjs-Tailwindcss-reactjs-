import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Events } from '/imports/api/events/events';
import { UserRsvps } from '/imports/api/rsvps/rsvps';

// --- Lucide React Icons ---
import {
  Search as FiSearch,
  Calendar as FiCalendar,
  Users as FiUsers,
  Wrench as FiTool,
  MapPin as FiMapPin,
  Clock as FiClock,
  DollarSign as FiDollarSign
} from 'lucide-react';

// ====================================================================================
// EventsPage Component
// ====================================================================================
export const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('upcoming');

  // --- MODIFIED: Meteor Data Integration using useTracker ---
  const { isLoading, allEvents, upcomingEvents, pastEvents, userRsvps } = useTracker(() => {
    // 1. Subscribe to the SINGLE 'events.all' publication
    const allEventsHandle = Meteor.subscribe('events.all');
    const userRsvpsHandle = Meteor.subscribe('rsvps.myEvents');

    // 2. Check if all necessary subscriptions are ready
    const isLoading = !allEventsHandle.ready() || !userRsvpsHandle.ready();

    // 3. Fetch ALL events from the client-side collection once ready
    const fetchedAllEvents = Events.find(
      {},
      { sort: { date: 1, time: 1 } } // Use consistent sorting from publication
    ).fetch();

    // Fetch the current user's RSVP records
    const fetchedUserRsvps = UserRsvps.find({}).fetch();

    // --- NEW CLIENT-SIDE CATEGORIZATION LOGIC ---
    // This is the main change: We now categorize events here based on the current time
    const now = new Date();
    // Get current date and time as YYYY-MM-DD and HH:MM strings for comparison
    const currentDateStr = now.toISOString().split('T')[0]; // e.g., "2025-06-09"
    const currentTimeStr = now.toTimeString().slice(0, 5); // e.g., "13:04"

    const upcoming = [];
    const past = [];

    fetchedAllEvents.forEach(event => {
      // Concatenate event date and time strings for comparison (e.g., "2025-06-09 14:00")
      const eventDateTimeStr = `${event.date} ${event.time}`;
      // Concatenate current date and time
      const currentDateTimeStr = `${currentDateStr} ${currentTimeStr}`;

      // Compare event's date-time string with current date-time string
      // This works because YYYY-MM-DD HH:MM strings are lexicographically sortable
      if (eventDateTimeStr >= currentDateTimeStr) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });
    // --- END NEW CLIENT-SIDE CATEGORIZATION LOGIC ---

    return {
      isLoading,
      allEvents: fetchedAllEvents, // All events from the publication
      upcomingEvents: upcoming,    // Categorized client-side
      pastEvents: past,            // Categorized client-side
      userRsvps: fetchedUserRsvps,
    };
  });
  // --- END MODIFIED: Meteor Data Integration ---

  // --- No changes needed here, existing UI logic remains intact ---
  const filterCounts = {
    all: allEvents.length,
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    workshop: allEvents.filter(e => e.type === 'workshop').length,
    meeting: allEvents.filter(e => e.type === 'meeting').length,
    social: allEvents.filter(e => e.type === 'social').length,
  };

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = false;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'upcoming') {
      // Use the new client-side derived upcomingEvents list
      matchesFilter = upcomingEvents.some(e => e._id === event._id);
    } else if (activeFilter === 'past') {
      // Use the new client-side derived pastEvents list
      matchesFilter = pastEvents.some(e => e._id === event._id);
    } else {
      matchesFilter = event.type === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  const handleRsvp = (eventId, wantsToAttend) => {
    console.log(`(EventsPage) Initiating RSVP for event ${eventId} (Wants to attend: ${wantsToAttend})`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-slate-100 p-4 md:p-8 flex justify-center items-center">
        <p className="text-xl text-orange-400">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Events Hub</h1>
          <p className="text-slate-400">Browse and join events in your community</p>
        </header>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-orange-400 w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-700 rounded-lg py-2 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterTab name="all" count={filterCounts.all} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
            <FilterTab name="upcoming" icon={<FiCalendar className="mr-1 w-4 h-4" />} count={filterCounts.upcoming} active={activeFilter === 'upcoming'} onClick={() => setActiveFilter('upcoming')} />
            <FilterTab name="past" icon={<FiClock className="mr-1 w-4 h-4" />} count={filterCounts.past} active={activeFilter === 'past'} onClick={() => setActiveFilter('past')} />
            <FilterTab name="workshop" icon={<FiTool className="mr-1 w-4 h-4" />} count={filterCounts.workshop} active={activeFilter === 'workshop'} onClick={() => setActiveFilter('workshop')} />
            <FilterTab name="meeting" icon={<FiUsers className="mr-1 w-4 h-4 " />} count={filterCounts.meeting} active={activeFilter === 'meeting'} onClick={() => setActiveFilter('meeting')} />
            <FilterTab name="social" icon={<FiUsers className="mr-1 w-4 h-4" />} count={filterCounts.social} active={activeFilter === 'social'} onClick={() => setActiveFilter('social')} />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No events found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                onRsvp={handleRsvp}
                // Determine if this event is in the past for dimming
                isPastEvent={pastEvents.some(e => e._id === event._id)} // Correctly uses client-side categorized pastEvents
                currentUserRsvps={userRsvps}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ====================================================================================
// Filter Tab Component & EventCard Component (no changes needed)
// ====================================================================================
const FilterTab = ({ name, icon, count, active, onClick }) => {
  const base = 'flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors';
  const classes = active ? 'bg-orange-400 text-white outline' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white';
  return (
    <button className={`${base} ${classes}`} onClick={onClick}>
      {icon}
      {name.charAt(0).toUpperCase() + name.slice(1)}
      <span className="ml-2 bg-black bg-opacity-10 px-2 py-0.5 rounded-full text-xs">{count}</span>
    </button>
  );
};

const EventCard = ({ event, onRsvp, isPastEvent, currentUserRsvps }) => {
  const typeColors = {
    workshop: 'bg-white text-slate-800',
    meeting: 'bg-white text-slate-800',
    social: 'bg-white text-slate-800',
  };

  const currentUserRsvp = currentUserRsvps.find(rsvp => rsvp.eventId === event._id && rsvp.userId === Meteor.userId());
  const isPendingPayment = currentUserRsvp && currentUserRsvp.status === 'pending_payment';
  const isConfirmed = currentUserRsvp && currentUserRsvp.status === 'confirmed';
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  const handleRsvpClick = async () => {
    if (!Meteor.userId()) {
      alert('You need to be logged in to interact with events. Please log in.');
      return;
    }

    if (isPastEvent) {
      alert('Cannot RSVP for past events.');
      return;
    }

    if (isConfirmed) {
      try {
        await Meteor.call('events.rsvp', event._id, false);
        setPaymentMessage('');
        alert('RSVP cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling RSVP:', error);
        alert(`Failed to cancel RSVP: ${error.error || error.reason}`);
      }
    } else if (isPendingPayment) {
      setShowPaymentInput(true);
      setPaymentMessage('Please enter your Mpesa phone number to complete registration.');
    } else {
      try {
        const result = await Meteor.call('events.rsvp', event._id, true);
        alert(result.message);
        if (result.message && result.message.includes("proceed to payment")) {
           setShowPaymentInput(true);
           setPaymentMessage('Please enter your Mpesa phone number to complete registration.');
        }
      } catch (error) {
        console.error('Error initiating RSVP:', error);
        alert(`Failed to RSVP: ${error.error || error.reason}`);
      }
    }
  };

  const handlePaymentSubmit = async () => {
    if (!phoneNumber || !/^2547[0-9]{8}$/.test(phoneNumber)) {
      setPaymentMessage('Please enter a valid Mpesa phone number (e.g., 2547XXXXXXXX).');
      return;
    }

    setPaymentMessage('Initiating payment... Please wait for STK Push on your phone.');
    try {
      const amount = 100;
      const result = await Meteor.call('events.processPayment', event._id, amount, phoneNumber);

      alert(result.message);
      setShowPaymentInput(false);
      setPaymentMessage('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentMessage(`Payment failed: ${error.error || error.reason}`);
      alert(`Payment failed: ${error.error || error.reason}`);
    }
  };

  let buttonText = 'RSVP Now';
  let buttonDisabled = isPastEvent;

  if (!isPastEvent) {
    if (isConfirmed) {
      buttonText = 'Attending (Cancel RSVP)';
      buttonDisabled = false;
    } else if (isPendingPayment) {
      buttonText = 'Complete Payment';
      buttonDisabled = false;
    } else if (event.registered >= event.capacity) {
      buttonText = 'Event Full';
      buttonDisabled = true;
    }
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-md border ${isPastEvent ? 'border-slate-800 opacity-60' : 'border-slate-700'}`}>
      <div className="bg-slate-800 p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`${typeColors[event.type]} text-xs px-2 py-1 rounded-full font-semibold`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
          <span className="text-slate-400 text-sm flex items-center">
            <FiCalendar className="w-4 h-4 mr-1" /> {event.date}
          </span>
        </div>

        <h3 className="text-xl font-bold text-orange-400 mb-2">{event.title}</h3>
        <p className="text-slate-400 text-sm mb-4 flex-grow">{event.description}</p>

        <div className="text-sm text-slate-400 mb-4 space-y-2">
          <div className="flex items-center"><FiUsers className="w-4 h-4 mr-2" /> {event.registered}/{event.capacity} attending</div>
          <div className="flex items-center"><FiMapPin className="w-4 h-4 mr-2" /> {event.location}</div>
          <div className="flex items-center"><FiClock className="w-4 h-4 mr-2" /> {event.time}</div>
        </div>

        {showPaymentInput ? (
          <div className="mt-auto">
            <p className="text-sm text-slate-300 mb-2">{paymentMessage}</p>
            <input
              type="tel"
              placeholder="Enter Mpesa Phone (e.g., 2547XXXXXXXX)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-700 rounded-md py-2 px-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
            />
            <button
              onClick={handlePaymentSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <FiDollarSign className="w-4 h-4 mr-2" /> Pay Now
            </button>
            <button
              onClick={() => {
                setShowPaymentInput(false);
                setPaymentMessage('');
                setPhoneNumber('');
              }}
              className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-md text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleRsvpClick}
            className={`mt-auto px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isConfirmed
                ? 'bg-slate-700 text-orange-400 hover:bg-orange-400 hover:text-white'
                : 'bg-orange-400 text-slate-900 hover:bg-orange-300'
            } ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={buttonDisabled}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};