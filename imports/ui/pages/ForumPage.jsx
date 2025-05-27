import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiPlus, FiChevronRight, FiEye, FiMessageCircle, FiClock } from 'react-icons/fi';
import { Page } from '../components/common/Page';
import { formatDateOnly } from '../../utils/formatting';

// This is a placeholder component until we connect to actual forum data
export const ForumPage = () => {
  const forumCategories = [
    {
      id: '1',
      name: 'Announcements',
      description: 'Important community announcements and updates',
      topicCount: 12,
      lastPost: { date: '2025-05-15T10:30:00Z', user: 'Admin' },
    },
    {
      id: '2',
      name: 'Events Discussion',
      description: 'Discuss upcoming and past community events',
      topicCount: 28,
      lastPost: { date: '2025-05-25T14:22:00Z', user: 'Sarah' },
    },
    {
      id: '3',
      name: 'General Discussion',
      description: 'Open discussions on various topics',
      topicCount: 56,
      lastPost: { date: '2025-05-26T09:45:00Z', user: 'Michael' },
    },
    {
      id: '4',
      name: 'Resources',
      description: 'Share helpful resources with the community',
      topicCount: 17,
      lastPost: { date: '2025-05-20T16:10:00Z', user: 'Jessica' },
    },
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Forums' }
  ];
  
  const actions = (
    <Link to="/forum/new" className="btn btn-primary">
      <FiPlus className="mr-1" /> New Topic
    </Link>
  );
  
  return (
    <Page 
      title="Community Forums"
      description="Welcome to our community forums. Browse existing discussions or start your own topic."
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div className="space-y-6">
        {forumCategories.map((category) => (
          <div key={category.id} className="card hover:shadow-glow transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                  <FiMessageSquare className="text-primary text-2xl" />
                </div>
                <div>
                  <Link to={`/forum/category/${category.id}`} className="text-xl font-medium hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                  <p className="text-muted mt-1">{category.description}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <Link to={`/forum/category/${category.id}`} className="text-primary">
                  <FiChevronRight size={24} />
                </Link>
              </div>
            </div>
            
            <div className="h-px w-full bg-divider-line opacity-20 my-4"></div>
            
            <div className="flex flex-wrap justify-between text-sm text-muted">
              <div className="flex space-x-4">
                <span className="flex items-center">
                  <FiMessageCircle className="mr-1" /> {category.topicCount} Topics
                </span>
                <span className="flex items-center">
                  <FiEye className="mr-1" /> Active
                </span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" /> 
                Last post by <span className="text-primary ml-1">{category.lastPost.user}</span> 
                <span className="mx-1">•</span>
                {formatDateOnly(category.lastPost.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
