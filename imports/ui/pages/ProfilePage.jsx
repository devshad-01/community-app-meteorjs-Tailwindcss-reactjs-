import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { User, Mail, Settings, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserMethods } from '/imports/api/users';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.profile?.name || ''
  });
  const [showEmailActions, setShowEmailActions] = useState(false);

  const handleSave = () => {
    Meteor.call(UserMethods.updateProfile, formData, (error) => {
      if (error) {
        alert('Error updating profile: ' + error.reason);
      } else {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    });
  };

  const handleSendVerificationEmail = () => {
    Meteor.call(UserMethods.sendVerificationEmail, (error) => {
      if (error) {
        alert('Error sending verification email: ' + error.reason);
      } else {
        alert('Verification email sent!');
      }
    });
  };

  // Update form data when user data changes
  React.useEffect(() => {
    if (user?.profile?.name && !isEditing) {
      setFormData({ name: user.profile.name });
    }
  }, [user, isEditing]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
              <User className="mr-3 h-8 w-8 text-indigo-500" />
              User Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your account settings and personal information
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-white">{user?.profile?.name || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Username:</label>
                  <p className="text-slate-900 dark:text-white">{user?.username || 'Not provided'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Role:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user?.profile?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {user?.profile?.role || 'member'}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since:</label>
                  <p className="text-slate-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Account Security</h2>
                <button
                  onClick={() => setShowEmailActions(!showEmailActions)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  {showEmailActions ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email:</label>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-900 dark:text-white">{user?.emails?.[0]?.address || 'Not provided'}</p>
                    {user?.emails?.[0]?.verified ? (
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium">Verified</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 text-xs font-medium">Unverified</span>
                    )}
                  </div>
                </div>

                {showEmailActions && (
                  <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {!user?.emails?.[0]?.verified && (
                      <button
                        onClick={handleSendVerificationEmail}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Verification Email
                      </button>
                    )}
                    
                    <button
                      onClick={() => alert('Password reset functionality would be implemented here')}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Change Password
                    </button>
                  </div>
                )}

                {/* Social Logins Info */}
                {(user?.services?.google || user?.services?.facebook || user?.services?.github) && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Connected Accounts:</label>
                    <div className="mt-2 space-y-2">
                      {user?.services?.google && (
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                          Google ({user.services.google.email})
                        </div>
                      )}
                      {user?.services?.facebook && (
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                          Facebook ({user.services.facebook.name})
                        </div>
                      )}
                      {user?.services?.github && (
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-4 h-4 bg-gray-800 rounded mr-2"></div>
                          GitHub ({user.services.github.username})
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};