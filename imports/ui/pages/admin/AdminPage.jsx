import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Users, Settings, Shield, Activity, Trash2, CalendarPlus } from 'lucide-react'; // NEW: Added CalendarPlus icon
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { UserPublications, UserMethods } from '/imports/api/users';
import { AddEventForm } from './AddEventForm.jsx'; // Correct path to your AddEventForm

export const AdminPage = () => {
  const { users, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe(UserPublications.allUsers);
    return {
      users: Meteor.users.find({}).fetch(),
      isLoading: !handle.ready()
    };
  }, []);

  const handleRoleChange = (userId, newRole) => {
    Meteor.call(UserMethods.updateRole, userId, newRole, (error) => {
      if (error) {
        alert('Error updating role: ' + error.reason);
      }
    });
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      Meteor.call(UserMethods.deleteUser, userId, (error) => {
        if (error) {
          alert('Error deleting user: ' + error.reason);
        }
      });
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage users, events, and system settings
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Admins</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {/* Assuming roles are directly on the user object, or adapt for alanning:roles if needed */}
                      {users.filter(u => u.roles?.includes('admin')).length}
                    </p>
                  </div>
                </div>
              </div>
              {/* You might want to get total number of events here using useTracker */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <CalendarPlus className="h-8 w-8 text-purple-500" /> {/* Changed icon to CalendarPlus */}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Events</p>
                    {/* Placeholder: You'd fetch actual event count from a publication here */}
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">-</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-500" /> {/* Changed icon to Activity */}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active RSVPs</p>
                    {/* Placeholder: You'd fetch actual active RSVP count from a publication here */}
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">-</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-8"> {/* Added mb-8 for spacing */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User Management</h2>
              </div>

              {isLoading ? (
                <div className="p-6">
                  <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {user.profile?.name || user.username || 'No name'}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                @{user.username || 'no-username'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                            {user.emails?.[0]?.address || 'No email'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                             {/* Assuming roles are an array directly on the user object, or use Roles.getRolesForUser */}
                            <select
                              value={user.roles?.includes('admin') ? 'admin' : 'member'} // Adjust based on your role structure
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={user._id === Meteor.userId()} // Prevent deleting self
                              className="text-red-600 hover:text-red-900 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* --- NEW: Event Management Section --- */}
            <div className=" rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-8">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Event Management</h2>
              </div>
              <div className="p-6">
                <AddEventForm /> {/* Your AddEventForm component is rendered here */}
              </div>
            </div>
            {/* --- END NEW: Event Management Section --- */}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};