import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Send, Image, Tag, Folder, X, Trash2 } from 'lucide-react';
import { useToastContext } from '../common/ToastProvider';

export const InlinePostComposer = ({ 
  categories = [], 
  selectedCategoryId = null, 
  onPostCreated,
  isExpanded = false,
  onToggleExpanded
}) => {
  const { success, error: showError } = useToastContext();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: selectedCategoryId || '',
    tags: '',
    pinned: false
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isContentFocused, setIsContentFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: event.target.result,
          size: file.size
        };
        
        setUploadedImages(prev => [...prev, imageData]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!formData.content.trim()) {
        throw new Error('Please enter content for your post');
      }
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      // Auto-generate title if not provided
      const title = formData.title.trim() || 
        formData.content.trim().substring(0, 50) + (formData.content.length > 50 ? '...' : '');

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      // Create post
      await Meteor.callAsync('forums.posts.create', {
        title: title,
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        tags,
        images: uploadedImages.map(img => img.data),
        pinned: formData.pinned
      });

      // Show success notification
      success(
        'Post Created!',
        `Your post has been published successfully.`,
        { duration: 3000 }
      );

      // Reset form
      setFormData({
        title: '',
        content: '',
        categoryId: selectedCategoryId || '',
        tags: '',
        pinned: false
      });
      setUploadedImages([]);
      setIsContentFocused(false);
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }
      
      // Collapse the composer if it was expanded
      if (onToggleExpanded) {
        onToggleExpanded(false);
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to create post';
      setError(errorMessage);
      
      // Show error toast
      showError(
        'Failed to Create Post',
        errorMessage,
        { duration: 6000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentFocus = () => {
    setIsContentFocused(true);
    if (onToggleExpanded) {
      onToggleExpanded(true);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: '',
      content: '',
      categoryId: selectedCategoryId || '',
      tags: '',
      pinned: false
    });
    setUploadedImages([]);
    setError('');
    setIsContentFocused(false);
    
    if (onToggleExpanded) {
      onToggleExpanded(false);
    }
  };

  const shouldShowExpandedForm = isExpanded || isContentFocused || formData.content.length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 mb-6 transition-all duration-300">
      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-4">
          {/* Content Input - Always Visible */}
          <div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              onFocus={handleContentFocus}
              placeholder="What's on your mind? Share your thoughts with the community..."
              rows={shouldShowExpandedForm ? 4 : 2}
              className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none transition-all duration-200"
              required
            />
          </div>

          {/* Expanded Form - Show when focused or has content */}
          {shouldShowExpandedForm && (
            <div className="space-y-4 animate-fadeIn">
              {/* Title - Optional */}
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title (optional - will be auto-generated if empty)"
                  className="w-full px-4 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
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

              {/* Tags */}
              <div>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Tags (optional - separate with commas)"
                  className="w-full px-4 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.data}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded-lg border border-warm-200 dark:border-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pin Post Option (for admins/moderators) */}
              {(Meteor.user()?.profile?.role === 'admin' || Meteor.user()?.profile?.role === 'moderator') && (
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
                    Pin this post
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-200 dark:border-slate-700">
          {/* Left side - Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 text-warm-600 dark:text-slate-400 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title="Add images"
            >
              <Image className="w-4 h-4 mr-1" />
              <span className="text-sm">Photo</span>
            </button>
            
            {shouldShowExpandedForm && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-3 py-2 text-warm-600 dark:text-slate-400 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                <span className="text-sm">Cancel</span>
              </button>
            )}
          </div>

          {/* Right side - Post button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.content.trim() || !formData.categoryId}
            className="px-6 py-2 bg-warm-500 hover:bg-warm-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
