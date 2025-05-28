// Forum page component with placeholder content
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const ForumPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { user } = useTracker(() => {
    return {
      user: Meteor.user()
    };
  });

  // Mock data - replace with actual Meteor collections later
  const categories = [
    { id: 'all', label: 'All Topics', count: 156, icon: '💬' },
    { id: 'faith-life', label: 'Faith & Life', count: 42, icon: '✝️' },
    { id: 'announcements', label: 'Announcements', count: 18, icon: '📢' },
    { id: 'events', label: 'Event Discussions', count: 24, icon: '📅' },
    { id: 'prayer', label: 'Prayer Requests', count: 31, icon: '🙏' },
    { id: 'support', label: 'Support & Encouragement', count: 28, icon: '🤝' },
    { id: 'general', label: 'General Discussion', count: 13, icon: '💭' }
  ];

  const posts = [
    {
      id: 1,
      title: 'Welcome to our new community forum!',
      content: 'We\'re excited to launch this new space for meaningful discussions...',
      author: 'Pastor David',
      authorRole: 'Pastor',
      category: 'announcements',
      createdAt: '2025-05-28T10:00:00Z',
      lastReply: '2025-05-28T14:30:00Z',
      replyCount: 23,
      views: 156,
      likes: 45,
      pinned: true,
      tags: ['welcome', 'community', 'announcement']
    },
    {
      id: 2,
      title: 'Prayer request for healing',
      content: 'Please keep my grandmother in your prayers as she undergoes surgery...',
      author: 'Sarah Johnson',
      authorRole: 'Member',
      category: 'prayer',
      createdAt: '2025-05-28T09:15:00Z',
      lastReply: '2025-05-28T13:45:00Z',
      replyCount: 18,
      views: 89,
      likes: 32,
      pinned: false,
      tags: ['prayer', 'healing', 'family']
    },
    {
      id: 3,
      title: 'Thoughts on Sunday\'s sermon about grace',
      content: 'Pastor David\'s message really resonated with me. I wanted to share some reflections...',
      author: 'Michael Chen',
      authorRole: 'Member',
      category: 'faith-life',
      createdAt: '2025-05-28T08:30:00Z',
      lastReply: '2025-05-28T12:20:00Z',
      replyCount: 15,
      views: 134,
      likes: 28,
      pinned: false,
      tags: ['sermon', 'grace', 'reflection']
    },
    {
      id: 4,
      title: 'Organizing a community service project',
      content: 'Who would be interested in helping organize a food drive for local families?',
      author: 'Emma Wilson',
      authorRole: 'Volunteer Coordinator',
      category: 'events',
      createdAt: '2025-05-28T07:45:00Z',
      lastReply: '2025-05-28T11:30:00Z',
      replyCount: 12,
      views: 67,
      likes: 19,
      pinned: false,
      tags: ['service', 'community', 'volunteer']
    },
    {
      id: 5,
      title: 'Study group for new believers',
      content: 'Starting a study group for anyone new to faith or wanting to strengthen their foundation...',
      author: 'Mary Thompson',
      authorRole: 'Small Group Leader',
      category: 'faith-life',
      createdAt: '2025-05-28T06:20:00Z',
      lastReply: '2025-05-28T10:15:00Z',
      replyCount: 8,
      views: 45,
      likes: 14,
      pinned: false,
      tags: ['study', 'newbelievers', 'growth']
    },
    {
      id: 6,
      title: 'Encouraging words for difficult times',
      content: 'Life has been challenging lately, but I wanted to share some verses that have helped me...',
      author: 'Jennifer Adams',
      authorRole: 'Member',
      category: 'support',
      createdAt: '2025-05-28T05:30:00Z',
      lastReply: '2025-05-28T09:00:00Z',
      replyCount: 22,
      views: 98,
      likes: 41,
      pinned: false,
      tags: ['encouragement', 'scripture', 'support']
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastReply) - new Date(a.lastReply);
      case 'popular':
        return b.likes - a.likes;
      case 'replies':
        return b.replyCount - a.replyCount;
      case 'views':
        return b.views - a.views;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Separate pinned posts
  const pinnedPosts = sortedPosts.filter(post => post.pinned);
  const regularPosts = sortedPosts.filter(post => !post.pinned);

  const getCategoryColor = (category) => {
    const colors = {
      'announcements': 'primary',
      'faith-life': 'accent',
      'prayer': 'warm',
      'events': 'secondary',
      'support': 'primary',
      'general': 'gray'
    };
    return colors[category] || 'gray';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getRoleColor = (role) => {
    const colors = {
      'Pastor': 'primary',
      'Volunteer Coordinator': 'accent',
      'Small Group Leader': 'secondary',
      'Member': 'gray'
    };
    return colors[role] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Community Forum
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Connect, share, and discuss with fellow community members
              </p>
            </div>
            {user && (
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                New Post
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Forum Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Forum Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Posts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                    <span className="font-semibold text-gray-900 dark:text-white">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Today's Posts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">12</span>
                  </div>
                </div>
              </div>

              {/* Online Members */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Online Now
                </h3>
                <div className="space-y-3">
                  {['Sarah Johnson', 'Michael Chen', 'Emma Wilson'].map(name => (
                    <div key={name} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Sort */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-warm p-6 mb-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts, tags, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔍</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="recent">Recent Activity</option>
                    <option value="popular">Most Popular</option>
                    <option value="replies">Most Replies</option>
                    <option value="views">Most Views</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  📌 Pinned Posts
                </h2>
                <div className="space-y-4">
                  {pinnedPosts.map(post => (
                    <div
                      key={post.id}
                      className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 hover:shadow-warm transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {post.author.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-200">
                              {post.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{post.author}</span>
                              <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(post.authorRole)}-100 text-${getRoleColor(post.authorRole)}-800`}>
                                {post.authorRole}
                              </span>
                              <span>•</span>
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800`}>
                          {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{post.replyCount} replies</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>👁️</span>
                            <span>{post.views} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{post.likes} likes</span>
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Last reply {formatTimeAgo(post.lastReply)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                <span>Recent Discussions ({regularPosts.length})</span>
              </h2>
              
              {regularPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-warm hover:shadow-warm-lg p-6 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br from-${getCategoryColor(post.category)}-500 to-${getCategoryColor(post.category)}-600 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{post.author}</span>
                          <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(post.authorRole)}-100 text-${getRoleColor(post.authorRole)}-800`}>
                            {post.authorRole}
                          </span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.category)}-100 text-${getCategoryColor(post.category)}-800`}>
                      {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.label}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{post.replyCount} replies</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>👁️</span>
                        <span>{post.views} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{post.likes} likes</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Last reply {formatTimeAgo(post.lastReply)}
                    </div>
                  </div>
                </div>
              ))}

              {regularPosts.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">💬</span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  {user && (
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                      Start a new discussion
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
