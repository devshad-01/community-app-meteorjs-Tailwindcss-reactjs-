// Events page component with placeholder content
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'

  const { user } = useTracker(() => {
    return {
      user: Meteor.user()
    };
  });

  // Mock data - replace with actual Meteor collections later
  const categories = [
    { id: 'all', label: 'All Events', count: 23 },
    { id: 'worship', label: 'Worship', count: 8 },
    { id: 'study', label: 'Bible Study', count: 6 },
    { id: 'fellowship', label: 'Fellowship', count: 5 },
    { id: 'service', label: 'Service', count: 4 }
  ];

  const events = [
    {
      id: 1,
      title: 'Sunday Morning Worship',
      description: 'Join us for our weekly worship service with inspiring music and teaching.',
      date: '2025-06-01',
      time: '10:00 AM',
      duration: '90 minutes',
      location: 'Main Sanctuary',
      category: 'worship',
      attendees: 156,
      maxAttendees: 200,
      featured: true,
      organizer: 'Pastor David',
      image: null,
      rsvpStatus: user ? 'attending' : null
    },
    {
      id: 2,
      title: 'Community Bible Study',
      description: 'Deep dive into the Book of Romans with discussion and reflection.',
      date: '2025-06-03',
      time: '7:00 PM',
      duration: '2 hours',
      location: 'Fellowship Hall',
      category: 'study',
      attendees: 24,
      maxAttendees: 30,
      featured: false,
      organizer: 'Sarah Johnson',
      image: null,
      rsvpStatus: null
    },
    {
      id: 3,
      title: 'Youth Fellowship Night',
      description: 'Fun activities, games, and fellowship for teenagers and young adults.',
      date: '2025-06-05',
      time: '6:30 PM',
      duration: '3 hours',
      location: 'Youth Center',
      category: 'fellowship',
      attendees: 42,
      maxAttendees: 50,
      featured: true,
      organizer: 'Michael Chen',
      image: null,
      rsvpStatus: null
    },
    {
      id: 4,
      title: 'Community Service Day',
      description: 'Join us in serving our local community through various outreach activities.',
      date: '2025-06-07',
      time: '9:00 AM',
      duration: '6 hours',
      location: 'Various Locations',
      category: 'service',
      attendees: 38,
      maxAttendees: 60,
      featured: false,
      organizer: 'Emma Wilson',
      image: null,
      rsvpStatus: null
    },
    {
      id: 5,
      title: 'Prayer and Meditation Circle',
      description: 'A quiet time for prayer, meditation, and spiritual reflection.',
      date: '2025-06-08',
      time: '7:00 AM',
      duration: '60 minutes',
      location: 'Prayer Garden',
      category: 'worship',
      attendees: 15,
      maxAttendees: 25,
      featured: false,
      organizer: 'Mary Thompson',
      image: null,
      rsvpStatus: null
    },
    {
      id: 6,
      title: 'Family Fun Day',
      description: 'A day of activities for the whole family with food, games, and entertainment.',
      date: '2025-06-10',
      time: '12:00 PM',
      duration: '4 hours',
      location: 'Community Park',
      category: 'fellowship',
      attendees: 89,
      maxAttendees: 120,
      featured: true,
      organizer: 'Jennifer Adams',
      image: null,
      rsvpStatus: null
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = events.filter(event => event.featured);

  const handleRSVP = (eventId, status) => {
    // TODO: Implement RSVP functionality with Meteor methods
    console.log(`RSVP ${status} for event ${eventId}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      worship: 'primary',
      study: 'accent',
      fellowship: 'secondary',
      service: 'warm'
    };
    return colors[category] || 'gray';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRSVPButtonStyle = (rsvpStatus) => {
    if (rsvpStatus === 'attending') {
      return 'bg-blue-500 text-white hover:bg-blue-600';
    }
    return 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Community Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and join upcoming events in our community
              </p>
            </div>
            {user && (
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 transform hover:scale-105">
                Create Event
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6 mb-8">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="lg:w-32">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  View
                </label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    📊
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                      viewMode === 'calendar'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    📅
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredEvents.map(event => (
                <div
                  key={event.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-warm hover:shadow-warm-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <span className="text-4xl text-white">📅</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(event.category)}-100 text-${getCategoryColor(event.category)}-800`}>
                        ⭐ Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-${getCategoryColor(event.category)}-600`}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-2">📅</span>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-2">🕐</span>
                        {event.time} ({event.duration})
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-2">👥</span>
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {user && (
                        <button
                          onClick={() => handleRSVP(event.id, event.rsvpStatus === 'attending' ? 'not-attending' : 'attending')}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${getRSVPButtonStyle(event.rsvpStatus)}`}
                        >
                          {event.rsvpStatus === 'attending' ? 'Attending ✓' : 'RSVP'}
                        </button>
                      )}
                      <button className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Events */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Events ({filteredEvents.length})
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-warm hover:shadow-warm-lg transition-all duration-200 p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(event.category)}-100 text-${getCategoryColor(event.category)}-800`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {event.description}
                  </p>
                  
                  <div className="space-y-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>📅 {formatDate(event.date)}</div>
                    <div>🕐 {event.time}</div>
                    <div>📍 {event.location}</div>
                    <div>👥 {event.attendees}/{event.maxAttendees}</div>
                  </div>

                  <div className="flex space-x-2">
                    {user && (
                      <button
                        onClick={() => handleRSVP(event.id, event.rsvpStatus === 'attending' ? 'not-attending' : 'attending')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${getRSVPButtonStyle(event.rsvpStatus)}`}
                      >
                        {event.rsvpStatus === 'attending' ? 'Attending ✓' : 'RSVP'}
                      </button>
                    )}
                    <button className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 text-sm">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <span className="text-4xl mb-4 block">📅</span>
                <p>Calendar view coming soon...</p>
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
