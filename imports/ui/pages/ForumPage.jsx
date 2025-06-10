import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { 
  ForumCategories, 
  ForumPosts, 
  ForumReplies,
  ForumPublications, 
  ForumMethods,
  ForumFormatting,
  FORUM_CONSTANTS 
} from '../../api/forums';
import { useToastContext } from '../components/common/ToastProvider';
import { useForumActions } from '../hooks/useForumActions';
import { 
  ForumHeader,
  ForumSidebar,
  SearchAndSort,
  PostsList,
  NewPostModal
} from '../components/forum';
import { GeneralChat } from '../components/chat';

export const ForumPage = () => {
  const { success, error: showError } = useToastContext();
  const navigate = useNavigate();
  const { handleLikePost: likePost, handleSubmitReply: submitReply, handleLikeReply: likeReply } = useForumActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showGeneralChat, setShowGeneralChat] = useState(false);
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

  // Separate subscriptions for better performance and reduced reactivity
  const { user, categories, loading: categoriesLoading } = useTracker(() => {
    const categoriesHandle = Meteor.subscribe(ForumPublications.categories);
    
    const loading = !categoriesHandle.ready();
    
    if (loading) {
      return {
        user: Meteor.user(),
        categories: [],
        loading: true
      };
    }

    // Get categories from database
    const categoriesFromDB = ForumCategories.find({}, { sort: { order: 1, name: 1 } }).fetch();
    
    // Add "All Topics" option with stable structure
    const allCategories = [
      { 
        _id: 'all', 
        name: 'All Topics', 
        postCount: 0,
        icon: '💬' 
      },
      ...categoriesFromDB
    ];

    return {
      user: Meteor.user(),
      categories: allCategories,
      loading: false
    };
  }, []); // No dependencies for stable categories

  // Single unified subscription for posts and replies to reduce reactive cycles
  const { posts, allReplies, loading: dataLoading } = useTracker(() => {
    // Prepare subscription parameters
    const postSubParams = {
      categoryId: selectedCategory === 'all' ? null : selectedCategory,
      searchTerm: debouncedSearchTerm || null,
      sortBy,
      limit: 50
    };

    const postsHandle = Meteor.subscribe(ForumPublications.postsList, postSubParams);
    const usersHandle = Meteor.subscribe('usersBasic');

    const loading = !postsHandle.ready() || !usersHandle.ready();

    if (loading) {
      return {
        posts: [],
        allReplies: [],
        loading: true
      };
    }

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

    // Get replies for the current posts
    const postsIds = postsFromDB.map(post => post._id);
    let repliesData = [];
    
    if (postsIds.length > 0) {
      // Subscribe to replies for current posts
      const repliesHandles = postsIds.map(postId => 
        Meteor.subscribe(ForumPublications.repliesByPost, postId, {
          limit: 10,
          sortBy: 'oldest'
        })
      );

      const repliesLoading = repliesHandles.some(handle => !handle.ready());
      
      if (!repliesLoading) {
        repliesData = ForumReplies.find({
          postId: { $in: postsIds }
        }, { sort: { createdAt: 1 } }).fetch();
      }
    }

    return {
      posts: postsFromDB,
      allReplies: repliesData,
      loading: false
    };
  }, [selectedCategory, debouncedSearchTerm, sortBy]);

  const loading = categoriesLoading || dataLoading;

  // Memoize filtered and sorted posts to prevent unnecessary re-calculations
  const { pinnedPosts, regularPosts } = useMemo(() => {
    const pinned = posts.filter(post => post.pinned);
    const regular = posts.filter(post => !post.pinned);
    return { pinnedPosts: pinned, regularPosts: regular };
  }, [posts]);

  // Memoize helper functions to prevent unnecessary re-renders
  const getCategoryColor = useCallback((categoryId) => {
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
  }, [categories]);

  const getCategoryInfo = useCallback((categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category || { name: 'General', icon: '💭' };
  }, [categories]);

  // Memoize other helper functions
  const formatTimeAgo = useCallback((date) => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }, []);

  const getUserRole = useCallback((userId) => {
    // For now, return a default role - this can be enhanced with actual user roles
    const user = Meteor.users.findOne(userId);
    return user?.profile?.role || 'Member';
  }, []);

  const getRoleColor = useCallback((role) => {
    const colors = {
      'Pastor': 'warm',
      'Volunteer Coordinator': 'orange',
      'Small Group Leader': 'blue',
      'Member': 'slate'
    };
    return colors[role] || 'slate';
  }, []);

  // Memoize search and sort handlers to prevent SearchAndSort re-renders
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  // Memoize category change handler to prevent ForumSidebar re-renders
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleNewPost = () => {
    if (!user) {
      alert('Please log in to create a new post');
      return;
    }
    setShowNewPostModal(true);
  };

  const handleToggleChat = () => {
    if (!user) {
      alert('Please log in to access chat');
      return;
    }
    setShowGeneralChat(!showGeneralChat);
  };

  const toggleReply = (postId) => {
    setReplyToggles(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleShowMoreReplies = useCallback((postId) => {
    setShowMoreReplies(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }, []);

  const handleReplyContentChange = (postId, content) => {
    setReplyContents(prev => ({
      ...prev,
      [postId]: content
    }));
  };

  const handleLikePost = useCallback(async (postId) => {
    if (!user) {
      showError('Authentication Required', 'Please log in to like posts');
      return;
    }

    try {
      await likePost(postId);
      // Don't show success message for likes to avoid spam
    } catch (error) {
      showError('Like Failed', error.message);
    }
  }, [user, likePost, showError]);

  const handleSubmitReply = useCallback(async (e, postId) => {
    e.preventDefault();
    if (!user) {
      showError('Authentication Required', 'Please log in to reply');
      return;
    }

    const content = replyContents[postId];
    if (!content || !content.trim()) {
      showError('Empty Reply', 'Please enter a reply before submitting');
      return;
    }

    setSubmittingReplies(prev => ({ ...prev, [postId]: true }));
    try {
      await submitReply({
        postId,
        content: content.trim()
      });
      
      // Show success notification
      success(
        'Reply Posted!',
        'Your reply has been posted successfully.',
        { duration: 3000 }
      );
      
      // Clear reply content and close reply box
      setReplyContents(prev => ({ ...prev, [postId]: '' }));
      setReplyToggles(prev => ({ ...prev, [postId]: false }));
    } catch (error) {
      showError(
        'Failed to Post Reply',
        error.message,
        { duration: 5000 }
      );
    } finally {
      setSubmittingReplies(prev => ({ ...prev, [postId]: false }));
    }
  }, [user, replyContents, submitReply, success, showError]);

  const handleLikeReply = useCallback(async (replyId) => {
    if (!user) {
      showError('Authentication Required', 'Please log in to like replies');
      return;
    }

    try {
      await likeReply(replyId);
      // Don't show success message for likes to avoid spam
    } catch (error) {
      showError('Like Failed', error.message);
    }
  }, [user, likeReply, showError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <ForumHeader 
        user={user} 
        onNewPost={handleNewPost} 
        onToggleChat={handleToggleChat}
        isChatOpen={showGeneralChat}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Stable, outside reactive context */}
          <div className="lg:col-span-1">
            <ForumSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              loading={categoriesLoading}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Sort - Stable, outside reactive posts context */}
            <SearchAndSort
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />

            {showGeneralChat ? (
              <GeneralChat 
                isOpen={showGeneralChat}
                onClose={() => setShowGeneralChat(false)}
                user={user}
              />
            ) : dataLoading ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-warm border border-warm-200 dark:border-slate-700 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-3/4"></div>
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-1/2"></div>
                  <div className="h-4 bg-warm-200 dark:bg-slate-600 rounded w-5/6"></div>
                </div>
              </div>
            ) : (
              <>
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
                  handleLikeReply={handleLikeReply}
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
                  handleLikeReply={handleLikeReply}
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