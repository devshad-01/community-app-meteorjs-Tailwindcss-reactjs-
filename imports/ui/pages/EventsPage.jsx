import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMap, FiClock, FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { Page } from '../components/common/Page';
import { formatCalendarDate, formatTime } from '../../utils/formatting';

// This is a placeholder component until we connect to actual event data
export const EventsPage = () => {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  
  const events = [
    {
      id: '1',
      title: 'Community Gathering',
      description: 'Monthly community gathering',
      start: '2025-05-30T18:00:00',
      end: '2025-05-30T20:00:00',
      location: 'Community Center',
      attendees: 24
    },
    {
      id: '2',
      title: 'Volunteer Day',
      description: 'Help clean up the local park',
      start: '2025-06-05T09:00:00',
      end: '2025-06-05T12:00:00',
      location: 'City Park',
      attendees: 12
    },
    {
      id: '3',
      title: 'Educational Workshop',
      description: 'Learn about sustainability',
      start: '2025-06-10T14:00:00',
      end: '2025-06-10T16:00:00',
      location: 'Community Library',
      attendees: 18
    },
    {
      id: '4',
      title: 'Music Night',
      description: 'Live music and refreshments',
      start: '2025-06-15T19:00:00',
      end: '2025-06-15T22:00:00',
      location: 'Cultural Center',
      attendees: 45
    }
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Events' }
  ];
  
  const viewToggle = (
    <div className="bg-dark rounded-lg flex">
      <button 
        onClick={() => setView('calendar')}
        className={`px-4 py-2 flex items-center ${view === 'calendar' 
          ? 'text-primary bg-primary bg-opacity-10 rounded-lg' 
          : 'text-muted'}`}
      >
        <FiGrid className="mr-1" /> Calendar
      </button>
      <button 
        onClick={() => setView('list')}
        className={`px-4 py-2 flex items-center ${view === 'list' 
          ? 'text-primary bg-primary bg-opacity-10 rounded-lg' 
          : 'text-muted'}`}
      >
        <FiList className="mr-1" /> List
      </button>
    </div>
  );
  
  const actions = (
    <div className="flex space-x-4">
      {viewToggle}
      <Link to="/events/create" className="btn btn-primary">
        <FiPlus className="mr-1" /> Create Event
      </Link>
    </div>
  );

  return (
    <Page 
      title="Community Events"
      description="Browse and join upcoming community events or create your own."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      {view === 'calendar' ? (
        <div className="card">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              url: `/events/${event.id}`
            }))}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="auto"
            eventClassNames="bg-primary hover:bg-opacity-80 cursor-pointer"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="block">
              <div className="card hover:shadow-glow transition-shadow duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="min-w-[100px] w-full md:w-24 p-3 bg-primary bg-opacity-10 rounded-lg text-center">
                    <div className="text-primary text-xl font-bold">
                      {new Date(event.start).getDate()}
                    </div>
                    <div className="text-muted text-sm">
                      {new Date(event.start).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                    <p className="text-muted mb-4">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" /> {formatCalendarDate(event.start)}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" /> {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      <div className="flex items-center">
                        <FiMap className="mr-1" /> {event.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:self-center">
                    <div className="bg-primary bg-opacity-10 px-3 py-1 rounded-full text-primary text-sm">
                      {event.attendees} attending
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Page>
  );
};
