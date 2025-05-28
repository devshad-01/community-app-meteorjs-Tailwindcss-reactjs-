// Profile page component
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const { user, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('users.current');
    return {
      user: Meteor.user(),
      isLoading: !handler.ready()
    };
  });

  // Initialize form data with current user profile
  React.useEffect(() => {
    if (user && user.profile) {
      setFormData({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        email: user.emails?.[0]?.address || '',
        phone: user.profile.phone || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        interests: user.profile.interests || [],
        socialLinks: user.profile.socialLinks || {},
        preferences: user.profile.preferences || {}
      });
    }
  }, [user]);

  // Mock user data for demonstration - in real app, this would come from user object
  const userProfile = {
    firstName: formData.firstName || 'Sarah',
    lastName: formData.lastName || 'Johnson',
    email: formData.email || 'sarah.johnson@email.com',
    phone: formData.phone || '+1 (555) 123-4567',
    bio: formData.bio || 'Passionate about community service and spreading God\'s love. Mother of two wonderful children.',
    location: formData.location || 'Springfield, IL',
    joinDate: user?.profile?.joinedAt || '2024-03-15',
    birthDate: user?.profile?.birthDate || '1985-06-20',
    interests: formData.interests || ['Bible Study', 'Community Service', 'Music', 'Youth Ministry'],
    socialLinks: formData.socialLinks || {
      facebook: 'sarah.johnson',
      instagram: '@sarah_serves',
      twitter: ''
    },
    preferences: formData.preferences || {
      emailNotifications: true,
      pushNotifications: true,
      privateProfile: false,
      showEmail: false,
      showPhone: false
    }
  };

  // Mock activity data
  const recentActivity = [
    { 
      type: 'forum_post', 
      title: 'Shared thoughts on Sunday\'s sermon about grace',
      time: '2 hours ago',
      category: 'Faith & Life'
    },
    { 
      type: 'event_rsvp', 
      title: 'RSVP\'d to Community Bible Study',
      time: '1 day ago',
      category: 'Events'
    },
    { 
      type: 'prayer_request', 
      title: 'Posted prayer request for healing',
      time: '3 days ago',
      category: 'Prayer Circle'
    },
    { 
      type: 'event_created', 
      title: 'Created Youth Fellowship Night event',
      time: '1 week ago',
      category: 'Events'
    }
  ];

  const stats = [
    { label: 'Posts', value: '47', icon: '💬' },
    { label: 'Events Attended', value: '23', icon: '📅' },
    { label: 'Prayer Requests', value: '12', icon: '🙏' },
    { label: 'Days Active', value: '78', icon: '📊' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }));
  };

  const handleSave = () => {
    // Validate form
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save profile data via Meteor method
    Meteor.call('users.updateProfile', formData, (error) => {
      if (error) {
        console.error('Profile update failed:', error);
        setErrors({ general: error.reason || 'Failed to update profile' });
      } else {
        setIsEditing(false);
        setErrors({});
        console.log('Profile updated successfully');
      }
    });
  };

  const availableInterests = [
    'Bible Study', 'Community Service', 'Music', 'Youth Ministry', 
    'Prayer Circle', 'Worship Team', 'Children\'s Ministry', 'Missions',
    'Small Groups', 'Counseling', 'Teaching', 'Leadership'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    const icons = {
      forum_post: '💬',
      event_rsvp: '📅',
      prayer_request: '🙏',
      event_created: '✨'
    };
    return icons[type] || '📝';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-warm border-b border-warm-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.profile?.avatar || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=FF6B47&color=fff&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-primary-200 dark:border-primary-800 shadow-warm"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                {userProfile.bio}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>{userProfile.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>Joined {new Date(userProfile.joinDate).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio || userProfile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        rows="4"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location || userProfile.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone || userProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {userProfile.bio}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">📧</span>
                        <span className="text-gray-700 dark:text-gray-300">{userProfile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">📱</span>
                        <span className="text-gray-700 dark:text-gray-300">{userProfile.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">📍</span>
                        <span className="text-gray-700 dark:text-gray-300">{userProfile.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">🎂</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {new Date(userProfile.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <span>📝</span>
                    <span className="text-gray-700 dark:text-gray-300">Create Post</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <span>📅</span>
                    <span className="text-gray-700 dark:text-gray-300">Create Event</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <span>🙏</span>
                    <span className="text-gray-700 dark:text-gray-300">Prayer Request</span>
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Social Links
                </h3>
                <div className="space-y-3">
                  {userProfile.socialLinks.facebook && (
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📘</span>
                      <span className="text-gray-700 dark:text-gray-300">facebook.com/{userProfile.socialLinks.facebook}</span>
                    </div>
                  )}
                  {userProfile.socialLinks.instagram && (
                    <div className="flex items-center space-x-3">
                      <span className="text-pink-600">📷</span>
                      <span className="text-gray-700 dark:text-gray-300">{userProfile.socialLinks.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span>{getActivityIcon(activity.type)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{activity.category}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Privacy Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Privacy Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-gray-900 dark:text-white font-medium">
                      Private Profile
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Only show your profile to community members
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.privateProfile}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-gray-900 dark:text-white font-medium">
                      Show Email
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your email address on your profile
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.showEmail}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-gray-900 dark:text-white font-medium">
                      Show Phone
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your phone number on your profile
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.showPhone}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-gray-900 dark:text-white font-medium">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.emailNotifications}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-gray-900 dark:text-white font-medium">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.pushNotifications}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
