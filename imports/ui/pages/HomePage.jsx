// Home page component
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const HomePage = () => {
  const { user, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('users.current');
    return {
      user: Meteor.user(),
      isLoading: !handler.ready()
    };
  });

  const stats = [
    { label: 'Active Members', value: '1,247', icon: '👥', color: 'primary' },
    { label: 'Upcoming Events', value: '23', icon: '📅', color: 'accent' },
    { label: 'Forum Posts', value: '8,439', icon: '💬', color: 'secondary' },
    { label: 'Online Now', value: '156', icon: '🟢', color: 'primary' }
  ];

  const features = [
    {
      title: 'Community Events',
      description: 'Join workshops, meetings, and social gatherings organized by our community.',
      icon: '🎉',
      action: 'Browse Events',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Discussion Forums',
      description: 'Engage in meaningful conversations with community members on various topics.',
      icon: '💭',
      action: 'Join Discussions',
      gradient: 'from-accent-500 to-primary-500'
    },
    {
      title: 'Real-time Chat',
      description: 'Connect instantly with other members through our live chat system.',
      icon: '⚡',
      action: 'Start Chatting',
      gradient: 'from-secondary-500 to-accent-500'
    }
  ];

  const recentActivity = [
    { type: 'event', title: 'Weekly Community Meeting', time: '2 hours ago', user: 'Sarah Johnson' },
    { type: 'forum', title: 'New discussion in Faith & Life', time: '4 hours ago', user: 'Michael Chen' },
    { type: 'join', title: 'Welcome new member Emma Wilson', time: '6 hours ago', user: 'System' },
    { type: 'event', title: 'Bible Study Group', time: '1 day ago', user: 'Pastor David' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to Our{' '}
              <span className="text-primary-600 dark:text-primary-300 drop-shadow-sm">
                Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect, share, and grow together in faith. Join events, participate in discussions, 
              and build meaningful relationships with fellow community members.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 transform hover:scale-105">
                  Join Our Community
                </button>
                <button className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-lg font-semibold border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
                  Learn More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-warm hover:shadow-warm-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Discover What We Offer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore the various ways you can connect and engage with our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-warm hover:shadow-warm-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <button className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                  {feature.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Community Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'event' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' :
                      activity.type === 'forum' ? 'bg-accent-100 dark:bg-accent-900/20 text-accent-600' :
                      activity.type === 'join' ? 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600' :
                      'bg-gray-100 dark:bg-gray-600 text-gray-600'
                    }`}>
                      {activity.type === 'event' ? '📅' : 
                       activity.type === 'forum' ? '💬' : 
                       activity.type === 'join' ? '👋' : '📝'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Start your journey with us today and become part of something meaningful.
              </p>
              <button className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100">
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
