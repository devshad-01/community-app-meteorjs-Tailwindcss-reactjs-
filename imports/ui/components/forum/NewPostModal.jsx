import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { X, Send, Tag, FileText, Folder } from 'lucide-react';

export const NewPostModal = ({ isOpen, onClose, categories = [], selectedCategoryId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: selectedCategoryId || '',
    tags: '',
    pinned: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Please enter a title');
      }
      if (!formData.content.trim()) {
        throw new Error('Please enter content');
      }
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      // Create post
      await new Promise((resolve, reject) => {
        Meteor.call('forums.posts.create', {
          title: formData.title.trim(),
          content: formData.content.trim(),
          categoryId: formData.categoryId,
          tags,
          pinned: formData.pinned
        }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      // Reset form and close modal
      setFormData({
        title: '',
        content: '',
        categoryId: selectedCategoryId || '',
        tags: '',
        pinned: false
      });
      onClose();
      
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-warm-900 dark:text-white flex items-center">
            <FileText className="w-6 h-6 mr-2 text-warm-500 dark:text-orange-400" />
            Create New Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-warm-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-warm-700 dark:text-slate-300 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for your post..."
              className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="flex items-center text-sm font-medium text-warm-700 dark:text-slate-300 mb-2">
              <Folder className="w-4 h-4 mr-1" />
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              required
            >
              <option value="">Select a category...</option>
              {categories
                .filter(cat => cat._id !== 'all')
                .map(category => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-warm-700 dark:text-slate-300 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              rows={8}
              className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-vertical"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="flex items-center text-sm font-medium text-warm-700 dark:text-slate-300 mb-2">
              <Tag className="w-4 h-4 mr-1" />
              Tags (optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="prayer, community, announcement (separate with commas)"
              className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
            <p className="text-xs text-warm-500 dark:text-slate-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Pin Post (for admins/moderators) */}
          {Meteor.user()?.profile?.role === 'admin' || Meteor.user()?.profile?.role === 'moderator' ? (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pinned"
                name="pinned"
                checked={formData.pinned}
                onChange={handleInputChange}
                className="w-4 h-4 text-warm-600 bg-warm-100 border-warm-300 rounded focus:ring-warm-500 dark:focus:ring-orange-500 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              <label htmlFor="pinned" className="ml-2 text-sm font-medium text-warm-700 dark:text-slate-300">
                Pin this post (appears at the top of the forum)
              </label>
            </div>
          ) : null}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-warm-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-warm-300 dark:border-slate-600 text-warm-700 dark:text-slate-300 rounded-lg hover:bg-warm-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
