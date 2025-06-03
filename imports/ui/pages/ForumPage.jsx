import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { 
  ForumCategories, 
  ForumPosts, 
  ForumReplies,
  ForumPublications, 
  ForumMethods,
  ForumFormatting,
  FORUM_CONSTANTS 
} from '../../api/forums';
import { 
  ForumHeader,
  ForumSidebar,
  SearchAndSort,
  PostsList,
  NewPostModal
} from '../components/forum';

// Client-side collection for forum stats
const ForumStats = new Mongo.Collection('forumStats');

export const ForumPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [replyToggles, setReplyToggles] = useState({}); // Track which posts have reply boxes open
  const [replyContents, setReplyContents] = useState({}); // Track reply content for each post
  const [submittingReplies, setSubmittingReplies] = useState({}); // Track which replies are being submitted
  const [showMoreReplies, setShowMoreReplies] = useState({}); // Track which posts show all replies

  // Debounce search term to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { user, categories, posts, loading, forumStats, allReplies } = useTracker(() => {
    // Subscribe to forum data
    const categoriesHandle = Meteor.subscribe(ForumPublications.categories);
    const postsHandle = Meteor.subscribe(ForumPublications.postsList, {
      categoryId: selectedCategory === 'all' ? null : selectedCategory,
      searchTerm: debouncedSearchTerm || null,
      sortBy,
      limit: 50
    });
    const statsHandle = Meteor.subscribe(ForumPublications.stats);
    const usersHandle = Meteor.subscribe('usersBasic'); // Subscribe to basic user info

    // Subscribe to replies for all posts that are visible
    const repliesHandles = [];
    const visiblePosts = ForumPosts.find({}, { limit: 50 }).fetch();
    const postsIds = visiblePosts.map(post => post._id);
    
    postsIds.forEach(postId => {
      repliesHandles.push(Meteor.subscribe(ForumPublications.repliesByPost, postId, {
        limit: 10, // Load up to 10 replies per post initially
        sortBy: 'oldest'
      }));
    });

    const loading = !categoriesHandle.ready() || !postsHandle.ready() || !statsHandle.ready() || !usersHandle.ready() || repliesHandles.some(handle => !handle.ready());

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
    
    // Add "All Topics" option - use static count to avoid re-renders
    const allCategories = [
      { 
        _id: 'all', 
        name: 'All Topics', 
        postCount: 0, // Will be updated by stats
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
    if (debouncedSearchTerm) {
      postQuery.$or = [
        { title: { $regex: debouncedSearchTerm, $options: 'i' } },
        { content: { $regex: debouncedSearchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(debouncedSearchTerm, 'i')] } }
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

    // Get forum statistics from the client collection only
    const statsData = ForumStats.findOne('global');

    // Get all replies for the visible posts
    const repliesData = ForumReplies.find({
      postId: { $in: postsIds }
    }, { sort: { createdAt: 1 } }).fetch();

    return {
      user: Meteor.user(),
      categories: allCategories,
      posts: postsFromDB,
      loading: false,
      forumStats: statsData || {
        totalPosts: 0,
        totalReplies: 0,
        recentPosts: 0
      },
      allReplies: repliesData
    };
  }, [selectedCategory, debouncedSearchTerm, sortBy]); // Only depend on these specific values

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

  const toggleShowMoreReplies = (postId) => {
    setShowMoreReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
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

  const toggleReply = (postId) => {
    setReplyToggles(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleReplyContentChange = (postId, content) => {
    setReplyContents(prev => ({
      ...prev,
      [postId]: content
    }));
  };

  const handleLikePost = async (postId) => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      await Meteor.callAsync(ForumMethods.votePost, postId, 'like');
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleSubmitReply = async (e, postId) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to reply');
      return;
    }

    const content = replyContents[postId];
    if (!content || !content.trim()) {
      alert('Please enter a reply');
      return;
    }

    setSubmittingReplies(prev => ({ ...prev, [postId]: true }));
    try {
      await Meteor.callAsync(ForumMethods.createReply, {
        postId,
        content: content.trim()
        // omit parentReplyId for top-level replies since it's optional
      });
      
      // Clear reply content and close reply box
      setReplyContents(prev => ({ ...prev, [postId]: '' }));
      setReplyToggles(prev => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to create reply. Please try again.');
    } finally {
      setSubmittingReplies(prev => ({ ...prev, [postId]: false }));
    }
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
      <ForumHeader user={user} onNewPost={handleNewPost} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ForumSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              forumStats={forumStats}
              loading={loading}
            />
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
                <SearchAndSort
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />

                {/* Pinned Posts */}
                <PostsList
                  posts={pinnedPosts}
                  user={user}
                  isPinned={true}
                  title="Pinned Posts"
                  categoryInfo={getCategoryInfo}
                  getCategoryColor={getCategoryColor}
                  getRoleColor={getRoleColor}
                  formatTimeAgo={formatTimeAgo}
                  getUserRole={getUserRole}
                  handleLikePost={handleLikePost}
                  toggleReply={toggleReply}
                  replyToggles={replyToggles}
                  replyContents={replyContents}
                  submittingReplies={submittingReplies}
                  handleReplyContentChange={handleReplyContentChange}
                  handleSubmitReply={handleSubmitReply}
                  allReplies={allReplies}
                  showMoreReplies={showMoreReplies}
                  toggleShowMoreReplies={toggleShowMoreReplies}
                  onNewPost={handleNewPost}
                />

                {/* Regular Posts */}
                <PostsList
                  posts={regularPosts}
                  user={user}
                  isPinned={false}
                  title={`Recent Discussions (${regularPosts.length})`}
                  categoryInfo={getCategoryInfo}
                  getCategoryColor={getCategoryColor}
                  getRoleColor={getRoleColor}
                  formatTimeAgo={formatTimeAgo}
                  getUserRole={getUserRole}
                  handleLikePost={handleLikePost}
                  toggleReply={toggleReply}
                  replyToggles={replyToggles}
                  replyContents={replyContents}
                  submittingReplies={submittingReplies}
                  handleReplyContentChange={handleReplyContentChange}
                  handleSubmitReply={handleSubmitReply}
                  allReplies={allReplies}
                  showMoreReplies={showMoreReplies}
                  toggleShowMoreReplies={toggleShowMoreReplies}
                  onNewPost={handleNewPost}
                />
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