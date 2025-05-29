import React, { useState } from 'react';
import { 
  Search as FiSearch,
  Calendar as FiCalendar,
  Users as FiUsers,
  Wrench as FiTool,
  Star as FiStar,
  MapPin as FiMapPin,
  Clock as FiClock
} from 'lucide-react';

 export const EventsPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock data - replace with your Meteor.js collection data
  const events = [
    {
      id: 1,
      title: 'React Workshop',
      type: 'workshop',
      date: '2023-06-15',
      time: '14:00',
      location: 'Virtual',
      description: 'Learn React hooks and context API',
      featured: true,
      attending: false,
      capacity: 30,
      registered: 18,
    },
    {
      id: 2,
      title: 'Team Standup',
      type: 'meeting',
      date: '2023-06-10',
      time: '09:30',
      location: 'Conference Room A',
      description: 'Daily team sync',
      featured: false,
      attending: true,
      capacity: 15,
      registered: 12,
    },
    {
      id: 3,
      title: 'Summer Social',
      type: 'social',
      date: '2023-06-20',
      time: '18:00',
      location: 'Rooftop Terrace',
      description: 'Quarterly team social event',
      featured: true,
      attending: false,
      capacity: 50,
      registered: 32,
    },
    {
      id: 4,
      title: 'Project Retrospective',
      type: 'meeting',
      date: '2023-06-12',
      time: '11:00',
      location: 'Zoom',
      description: 'Review of Q2 initiatives',
      featured: false,
      attending: false,
      capacity: 25,
      registered: 8,
    },
    {
      id: 5,
      title: 'CSS Masterclass',
      type: 'workshop',
      date: '2023-06-18',
      time: '16:00',
      location: 'Training Room 2',
      description: 'Advanced CSS techniques',
      featured: false,
      attending: false,
      capacity: 20,
      registered: 14,
    },
    {
      id: 6,
      title: 'Hackathon Kickoff',
      type: 'social',
      date: '2023-06-25',
      time: '10:00',
      location: 'Main Hall',
      description: 'Annual coding competition',
      featured: true,
      attending: true,
      capacity: 100,
      registered: 78,
    },
  ];

  // Filter counts
  const filterCounts = {
    all: events.length,
    workshop: events.filter(e => e.type === 'workshop').length,
    meeting: events.filter(e => e.type === 'meeting').length,
    social: events.filter(e => e.type === 'social').length,
    featured: events.filter(e => e.featured).length,
  };

  // Filtered events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'featured' ? event.featured : event.type === activeFilter);
    
    return matchesSearch && matchesFilter;
  });

  // RSVP handler - replace with your Meteor method call
  const handleRsvp = (eventId, attending) => {
    // Here you would typically call a Meteor method like:
    // Meteor.call('events.rsvp', eventId, attending, (error) => {
    //   if (!error) {
    //     // Update local state or refetch data
    //   }
    // });
    
    // For now, we'll just update the mock data
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex].attending = attending;
      if (attending) {
        events[eventIndex].registered += 1;
      } else {
        events[eventIndex].registered -= 1;
      }
    }
    // Force re-render with the new state
    setSearchTerm(searchTerm + ' ');
    setSearchTerm(searchTerm);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">Upcoming Events</h1>
          <p className="text-slate-400">Browse and join upcoming events in your community</p>
        </header>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-500 w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full bg-slate-800 rounded-lg py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <FilterTab 
              name="all" 
              count={filterCounts.all} 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            />
            <FilterTab 
              name="workshop" 
              icon={<FiTool className="mr-1 w-4 h-4" />} 
              count={filterCounts.workshop} 
              active={activeFilter === 'workshop'} 
              onClick={() => setActiveFilter('workshop')}
            />
            <FilterTab 
              name="meeting" 
              icon={<FiUsers className="mr-1 w-4 h-4" />} 
              count={filterCounts.meeting} 
              active={activeFilter === 'meeting'} 
              onClick={() => setActiveFilter('meeting')}
            />
            <FilterTab 
              name="social" 
              icon={<FiUsers className="mr-1 w-4 h-4" />} 
              count={filterCounts.social} 
              active={activeFilter === 'social'} 
              onClick={() => setActiveFilter('social')}
            />
            <FilterTab 
              name="featured" 
              icon={<FiStar className="mr-1 w-4 h-4" />} 
              count={filterCounts.featured} 
              active={activeFilter === 'featured'} 
              onClick={() => setActiveFilter('featured')}
            />
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
                key={event.id} 
                event={event} 
                onRsvp={handleRsvp} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Tab Component
const FilterTab = ({ name, icon, count, active, onClick }) => {
  const activeClasses = active 
    ? 'bg-orange-500 text-slate-900' 
    : 'bg-slate-800 text-slate-300 hover:bg-slate-700';
  
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeClasses}`}
      onClick={onClick}
    >
      {icon}
      {name.charAt(0).toUpperCase() + name.slice(1)}
      <span className="ml-1 bg-slate-900 bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
        {count}
      </span>
    </button>
  );
};

// Event Card Component
const EventCard = ({ event, onRsvp }) => {
  const typeColors = {
    workshop: 'bg-blue-500',
    meeting: 'bg-purple-500',
    social: 'bg-green-500',
  };
  
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${event.featured ? 'border-2 border-orange-500' : 'border border-slate-700'}`}>
      {event.featured && (
        <div className="absolute top-2 right-2 bg-orange-500 text-slate-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <FiStar className="w-3 h-3 mr-1" /> Featured
        </div>
      )}
      
      <div className="bg-slate-800 p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`${typeColors[event.type]} text-xs px-2 py-1 rounded-full font-semibold`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
          <span className="text-slate-500 text-sm flex items-center">
            <FiCalendar className="w-4 h-4 mr-1" /> {event.date}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-slate-400 text-sm mb-4 flex-grow">{event.description}</p>
        
        <div className="text-sm text-slate-400 mb-4 space-y-2">
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-2" />
            {event.registered}/{event.capacity} attending
          </div>
          <div className="flex items-center">
            <FiMapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-2" />
            {event.time}
          </div>
        </div>
        
        <div className="mt-auto">
          {event.attending ? (
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
              onClick={() => onRsvp(event.id, false)}
            >
              Attending ✓
            </button>
          ) : (
            <button
              className={`w-full ${event.registered >= event.capacity ? 'bg-slate-600 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-slate-900 py-2 px-4 rounded transition-colors`}
              onClick={() => event.registered < event.capacity && onRsvp(event.id, true)}
              disabled={event.registered >= event.capacity}
            >
              {event.registered >= event.capacity ? 'Full' : 'RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};