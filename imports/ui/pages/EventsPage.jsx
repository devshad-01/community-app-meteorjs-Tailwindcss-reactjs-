import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export const EventsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-blue-500" />
              Community Events
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              This is the Events page - authentication required to access
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              Events functionality placeholder - only visible to authenticated users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};