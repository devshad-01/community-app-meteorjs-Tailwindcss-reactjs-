import { Meteor } from 'meteor/meteor';
import { ForumCategories, ForumPosts, ForumReplies, ForumTags } from '../collections';

Meteor.startup(async () => {
  // Create default forum categories if none exist
  const categoryCount = await ForumCategories.countDocuments();
  
  if (categoryCount === 0) {
    console.log('Creating default forum categories...');
    
    const defaultCategories = [
      {
        name: 'Announcements',
        description: 'Official announcements and important updates from the community leadership',
        icon: '📢',
        color: '#3B82F6',
        slug: 'announcements',
        order: 1,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Faith & Life',
        description: 'Discussions about faith, spiritual growth, and Christian living',
        icon: '✝️',
        color: '#10B981',
        slug: 'faith-life',
        order: 2,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prayer Requests',
        description: 'Share your prayer requests and pray for others in our community',
        icon: '🙏',
        color: '#8B5CF6',
        slug: 'prayer',
        order: 3,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Event Discussions',
        description: 'Talk about upcoming events, share experiences, and coordinate activities',
        icon: '📅',
        color: '#F59E0B',
        slug: 'events',
        order: 4,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Support & Encouragement',
        description: 'Find support, encouragement, and fellowship in times of need',
        icon: '🤝',
        color: '#EC4899',
        slug: 'support',
        order: 5,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'General Discussion',
        description: 'General topics and conversations that don\'t fit other categories',
        icon: '💭',
        color: '#06B6D4',
        slug: 'general',
        order: 6,
        postCount: 0,
        lastPostAt: null,
        lastPostId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const category of defaultCategories) {
      await ForumCategories.insertAsync(category);
    }
    
    console.log('Default forum categories created successfully!');
  }

  // Create some default tags if none exist
  const tagCount = await ForumTags.countDocuments();
  
  if (tagCount === 0) {
    console.log('Creating default forum tags...');
    
    const defaultTags = [
      { name: 'welcome', usageCount: 0, color: '#3B82F6', createdAt: new Date(), updatedAt: new Date() },
      { name: 'community', usageCount: 0, color: '#10B981', createdAt: new Date(), updatedAt: new Date() },
      { name: 'prayer', usageCount: 0, color: '#8B5CF6', createdAt: new Date(), updatedAt: new Date() },
      { name: 'sermon', usageCount: 0, color: '#F59E0B', createdAt: new Date(), updatedAt: new Date() },
      { name: 'bible-study', usageCount: 0, color: '#EC4899', createdAt: new Date(), updatedAt: new Date() },
      { name: 'fellowship', usageCount: 0, color: '#06B6D4', createdAt: new Date(), updatedAt: new Date() },
      { name: 'service', usageCount: 0, color: '#84CC16', createdAt: new Date(), updatedAt: new Date() },
      { name: 'testimony', usageCount: 0, color: '#F97316', createdAt: new Date(), updatedAt: new Date() },
      { name: 'youth', usageCount: 0, color: '#6366F1', createdAt: new Date(), updatedAt: new Date() },
      { name: 'family', usageCount: 0, color: '#14B8A6', createdAt: new Date(), updatedAt: new Date() }
    ];

    for (const tag of defaultTags) {
      await ForumTags.insertAsync(tag);
    }
    
    console.log('Default forum tags created successfully!');
  }
});
