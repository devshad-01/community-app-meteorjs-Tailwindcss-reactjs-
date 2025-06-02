import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { MessageSquare, Search, Users, Eye, Heart, MessageCircle, Calendar, Pin, Plus } from 'lucide-react';
import { 
  ForumCategories, 
  ForumPosts, 
  ForumPublications, 
  ForumMethods,
  ForumFormatting,
  FORUM_CONSTANTS 
} from '../../api/forums';
import { NewPostModal } from '../components/forum/NewPostModal';

// Client-side collection for forum stats
const ForumStats = new Mongo.Collection('forumStats');

export const ForumPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const { user, categories, posts, loading, forumStats } = useTracker(() => {
    // Subscribe to forum data
    const categoriesHandle = Meteor.subscribe(ForumPublications.categories);
    const postsHandle = Meteor.subscribe(ForumPublications.postsList, {
      categoryId: selectedCategory === 'all' ? null : selectedCategory,
      searchTerm: searchTerm || null,
      sortBy,
      limit: 50
    });
    const statsHandle = Meteor.subscribe(ForumPublications.stats);

    const loading = !categoriesHandle.ready() || !postsHandle.ready() || !statsHandle.ready();

    if (loading) {
      return {
        user: Meteor.user(),
        categories: [],
        posts: [],
        loading: true,
        forumStats: { totalPosts: 0, totalReplies: 0, recentPosts: 0 }
      };
    }

    // Get categories from database
    const categoriesFromDB = ForumCategories.find({}, { sort: { order: 1, name: 1 } }).fetch();
    
    // Add "All Topics" option
    const allCategories = [
      { 
        _id: 'all', 
        name: 'All Topics', 
        postCount: ForumPosts.find().count(), 
        icon: '💬' 
      },
      ...categoriesFromDB.map(cat => ({
        _id: cat._id,
        name: cat.name,
        postCount: cat.postCount || 0,
        icon: cat.icon
      }))
    ];

    // Build query for posts
    let postQuery = {};
    if (selectedCategory !== 'all') {
      postQuery.categoryId = selectedCategory;
    }
    if (searchTerm) {
      postQuery.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    switch (sortBy) {
      case 'recent':
        sortOptions = { lastReplyAt: -1, createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { likeCount: -1, createdAt: -1 };
        break;
      case 'replies':
        sortOptions = { replyCount: -1, createdAt: -1 };
        break;
      case 'views':
        sortOptions = { viewCount: -1, createdAt: -1 };
        break;
    }

    // Get posts from database
    const postsFromDB = ForumPosts.find(postQuery, { 
      sort: sortOptions,
      limit: 50
    }).fetch();

    // Get forum statistics from the client collection or calculate simple ones
    const statsData = ForumStats.findOne('global');
    
    // Fallback to simple client-side calculations
    const totalPosts = ForumPosts.find().count();
    const totalReplies = ForumPosts.find().fetch().reduce((sum, post) => sum + (post.replyCount || 0), 0);
    
    // Get today's posts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentPosts = ForumPosts.find({ 
      createdAt: { $gte: today } 
    }).count();

    return {
      user: Meteor.user(),
      categories: allCategories,
      posts: postsFromDB,
      loading: false,
      forumStats: statsData || {
        totalPosts,
        totalReplies,
        recentPosts
      }
    };
  }, [selectedCategory, searchTerm, sortBy]);

  // Filter and sort posts (done in the database query above)
  const filteredPosts = posts;
  const sortedPosts = posts;

  // Separate pinned posts
  const pinnedPosts = sortedPosts.filter(post => post.pinned);
  const regularPosts = sortedPosts.filter(post => !post.pinned);

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return 'slate';
    
    // Map category names to colors
    const colorMap = {
      'announcements': 'warm',
      'faith-life': 'orange', 
      'prayer': 'purple',
      'events': 'blue',
      'support': 'green',
      'general': 'slate'
    };
    
    // Try to match by name or slug
    const categoryName = category.name?.toLowerCase().replace(/\s+/g, '-');
    return colorMap[categoryName] || colorMap[category.slug] || 'slate';
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCategoryInfo = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category || { name: 'General', icon: '💭' };
  };

  const getUserRole = (userId) => {
    // For now, return a default role - this can be enhanced with actual user roles
    const user = Meteor.users.findOne(userId);
    return user?.profile?.role || 'Member';
  };

  const handleNewPost = () => {
    if (!user) {
      alert('Please log in to create a new post');
      return;
    }
    setShowNewPostModal(true);
  };

  const handlePostClick = (postId) => {
    // Navigate to post detail page
    alert(`Navigate to post ${postId}`);
  };

  const getRoleColor = (role) => {
    const colors = {
      'Pastor': 'warm',
      'Volunteer Coordinator': 'orange',
      'Small Group Leader': 'blue',
      'Member': 'slate'
    };
    return colors[role] || 'slate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="bg-white dark:bg-slate-800 shadow-lg border-b border-warm-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-warm-900 dark:text-white mb-2 flex items-center">
                <MessageSquare className="mr-3 h-8 w-8 text-warm-500 dark:text-orange-400" />
                Community Forum
              </h1>
              <p className="text-warm-600 dark:text-slate-400">
                Connect, share, and discuss with fellow community members
              </p>
            </div>
            {user && (
              <button 
                onClick={handleNewPost}
                className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
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
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category._id}
                      onClick={() => setSelectedCategory(category._id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category._id
                          ? 'bg-warm-50 dark:bg-orange-900/20 text-warm-700 dark:text-orange-300'
                          : 'text-warm-600 dark:text-slate-400 hover:bg-warm-25 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300 px-2 py-1 rounded-full">
                        {category.postCount || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Forum Stats */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4">
                  Forum Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-warm-600 dark:text-slate-400">Total Posts</span>
                    <span className="font-semibold text-warm-900 dark:text-white">
                      {loading ? '...' : forumStats.totalPosts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-600 dark:text-slate-400">Total Replies</span>
                    <span className="font-semibold text-warm-900 dark:text-white">
                      {loading ? '...' : forumStats.totalReplies}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-600 dark:text-slate-400">Today's Posts</span>
                    <span className="font-semibold text-warm-900 dark:text-white">
                      {loading ? '...' : forumStats.recentPosts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Online Members */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-warm-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Online Now
                </h3>
                <div className="space-y-3">
                  {['Sarah Johnson', 'Michael Chen', 'Emma Wilson'].map(name => (
                    <div key={name} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-warm-600 dark:text-slate-400">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-3/4"></div>
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-1/2"></div>
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <>
            {/* Search and Sort */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-6 mb-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts, tags, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-warm-400 dark:text-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-3 px-4 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
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
                <h2 className="text-xl font-semibold text-warm-900 dark:text-white mb-4 flex items-center">
                  <Pin className="w-5 h-5 mr-2 text-warm-500 dark:text-orange-400" />
                  Pinned Posts
                </h2>
                <div className="space-y-4">
                  {pinnedPosts.map(post => {
                    const categoryInfo = getCategoryInfo(post.categoryId);
                    const authorUser = Meteor.users.findOne(post.authorId);
                    const authorName = authorUser?.profile?.name || authorUser?.username || 'Unknown User';
                    const authorRole = getUserRole(post.authorId);
                    
                    return (
                    <div
                      key={post._id}
                      onClick={() => handlePostClick(post._id)}
                      className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-warm-900/20 dark:to-orange-900/20 border border-warm-200 dark:border-orange-800 rounded-xl p-6 hover:shadow-warm transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-warm-500 to-warm-600 dark:from-orange-500 dark:to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {authorName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-warm-900 dark:text-white hover:text-warm-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">
                              {post.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-warm-600 dark:text-slate-400">
                              <span>{authorName}</span>
                              <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(authorRole)}-100 dark:bg-${getRoleColor(authorRole)}-900/20 text-${getRoleColor(authorRole)}-800 dark:text-${getRoleColor(authorRole)}-300`}>
                                {authorRole}
                              </span>
                              <span>•</span>
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.categoryId)}-100 dark:bg-${getCategoryColor(post.categoryId)}-900/20 text-${getCategoryColor(post.categoryId)}-800 dark:text-${getCategoryColor(post.categoryId)}-300`}>
                          {categoryInfo.icon} {categoryInfo.name}
                        </span>
                      </div>
                      
                      <p className="text-warm-700 dark:text-slate-300 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm text-warm-500 dark:text-slate-400">
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replyCount || 0} replies</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views || 0} views</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{(post.likes || []).length} likes</span>
                          </span>
                        </div>
                        <div className="text-xs text-warm-400 dark:text-slate-500">
                          Last reply {formatTimeAgo(post.lastReplyAt)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-warm-900 dark:text-white flex items-center justify-between">
                <span>Recent Discussions ({regularPosts.length})</span>
              </h2>
              
              {regularPosts.map(post => {
                const categoryInfo = getCategoryInfo(post.categoryId);
                const authorUser = Meteor.users.findOne(post.authorId);
                const authorName = authorUser?.profile?.name || authorUser?.username || 'Unknown User';
                const authorRole = getUserRole(post.authorId);
                
                return (
                <div
                  key={post._id}
                  onClick={() => handlePostClick(post._id)}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-warm hover:shadow-warm-lg border border-warm-200 dark:border-slate-700 p-6 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br from-${getCategoryColor(post.categoryId)}-500 to-${getCategoryColor(post.categoryId)}-600 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {authorName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-warm-900 dark:text-white group-hover:text-warm-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                          {post.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-warm-600 dark:text-slate-400">
                          <span>{authorName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs bg-${getRoleColor(authorRole)}-100 dark:bg-${getRoleColor(authorRole)}-900/20 text-${getRoleColor(authorRole)}-800 dark:text-${getRoleColor(authorRole)}-300`}>
                            {authorRole}
                          </span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(post.categoryId)}-100 dark:bg-${getCategoryColor(post.categoryId)}-900/20 text-${getCategoryColor(post.categoryId)}-800 dark:text-${getCategoryColor(post.categoryId)}-300`}>
                      {categoryInfo.icon} {categoryInfo.name}
                    </span>
                  </div>
                  
                  <p className="text-warm-700 dark:text-slate-300 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-warm-100 dark:bg-slate-700 text-warm-700 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-warm-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replyCount || 0} replies</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views || 0} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{(post.likes || []).length} likes</span>
                      </span>
                    </div>
                    <div className="text-xs text-warm-400 dark:text-slate-500">
                      Last reply {formatTimeAgo(post.lastReplyAt)}
                    </div>
                  </div>
                </div>
                );
              })}

              {regularPosts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-warm-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-warm-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-warm-600 dark:text-slate-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  {user && (
                    <button 
                      onClick={handleNewPost}
                      className="bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Start a new discussion
                    </button>
                  )}
                </div>
              )}
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <NewPostModal 
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        categories={categories}
        selectedCategoryId={selectedCategory !== 'all' ? selectedCategory : null}
      />
    </div>
  );
};