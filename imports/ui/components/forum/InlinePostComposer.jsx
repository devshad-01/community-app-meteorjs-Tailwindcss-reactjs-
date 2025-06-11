import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Send, Image, Tag, Folder, X, Trash2, Paperclip } from 'lucide-react';
import { useToastContext } from '../common/ToastProvider';
import { UserAvatar } from '../common/UserAvatar';

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
        
        // Auto-expand the composer when image is uploaded
        setIsContentFocused(true);
        if (onToggleExpanded) {
          onToggleExpanded(true);
        }
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

  // Helper functions for UserAvatar component
  const getUserRole = (userId) => {
    const userData = userId ? Meteor.users.findOne(userId) : Meteor.user();
    return userData?.profile?.role || 'member';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'red',
      'member': 'purple'
    };
    return colors[role] || 'purple';
  };

  const shouldShowExpandedForm = isExpanded || isContentFocused || formData.content.length > 0;
  const shouldShowMiniComposer = !shouldShowExpandedForm;

  return (
    <div className={`transition-all duration-300 mb-3 md:mb-6 ${
      shouldShowExpandedForm 
        ? 'bg-white dark:bg-slate-800 rounded-lg md:rounded-xl shadow-lg border border-warm-200 dark:border-slate-700 hover:shadow-xl'
        : ''
    }`}>
      {/* Mini Composer - Minimal Mobile Design */}
      {shouldShowMiniComposer && (
        <div className="group px-1 py-0.5 md:p-4">
          <div 
            onClick={handleContentFocus}
            className="flex items-center gap-2 md:gap-3 px-2.5 py-1 md:p-3 rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-sm border border-warm-200/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-700/90 cursor-pointer"
          >
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <UserAvatar 
                user={Meteor.user()}
                size="sm"
                showTooltip={false}
                getRoleColor={getRoleColor}
                getUserRole={getUserRole}
                className="w-6 h-6 md:w-10 md:h-10"
              />
            </div>
            
            {/* Mini Input */}
            <input
              type="text"
              placeholder="What's on your mind?"
              readOnly
              className="flex-1 bg-transparent border-none outline-none text-sm text-warm-700 dark:text-slate-300 placeholder-warm-400 dark:placeholder-slate-500 cursor-pointer"
            />
            
            {/* Quick Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-1 md:p-2 text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 transition-all duration-200 hover:scale-110 rounded-full"
                title="Add photo"
              >
                <Image className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={handleContentFocus}
                className="p-1 md:p-2 text-warm-500 dark:text-orange-400 hover:text-warm-600 dark:hover:text-orange-300 transition-all duration-200 hover:scale-110 rounded-full"
                title="Add tags"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Hidden file input for mini composer */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Full Composer Form */}
      {shouldShowExpandedForm && (
        <form onSubmit={handleSubmit} className="p-3 md:p-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 mb-3">
            <p className="text-red-800 dark:text-red-300 text-xs">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-3">
          {/* Content Input - Always Visible */}
          <div className="flex space-x-2 md:space-x-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <UserAvatar 
                user={Meteor.user()}
                size="sm"
                showTooltip={false}
                getRoleColor={getRoleColor}
                getUserRole={getUserRole}
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </div>
            
            {/* Input Area */}
            <div className="flex-1">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                onFocus={handleContentFocus}
                placeholder="What's on your mind?"
                rows={shouldShowExpandedForm ? 3 : 1}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-0 bg-warm-50 dark:bg-slate-700 rounded-lg md:rounded-xl focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 dark:text-white resize-none transition-all duration-300 text-sm placeholder-warm-400 dark:placeholder-slate-500 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Expanded Form - Show when focused or has content */}
          {shouldShowExpandedForm && (
            <div className="space-y-3 animate-fadeIn">
              {/* Title - Optional */}
              <div className="ml-8 md:ml-11">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title (optional)"
                  className="w-full px-3 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>

              {/* Category & Tags Row */}
              <div className="ml-8 md:ml-11 grid grid-cols-1 gap-3">
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                  required
                >
                  <option value="">Select category...</option>
                  {categories
                    .filter(cat => cat._id !== 'all')
                    .map(category => (
                    <option key={category._id} value={category._id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Tags (comma separated)"
                  className="px-3 py-2 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="ml-8 md:ml-11">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.data}
                          alt={image.name}
                          className="w-full h-16 object-cover rounded-md border border-warm-200 dark:border-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pin Post Option (for admins/moderators) */}
              {(Meteor.user()?.profile?.role === 'admin' || Meteor.user()?.profile?.role === 'moderator') && (
                <div className="ml-8 md:ml-11 flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    name="pinned"
                    checked={formData.pinned}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-warm-600 bg-warm-100 border-warm-300 rounded focus:ring-warm-500 dark:focus:ring-orange-500 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <label htmlFor="pinned" className="ml-2 text-sm text-warm-700 dark:text-slate-300">
                    Pin this post
                  </label>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-warm-200 dark:border-slate-700">
          {/* Left side - Action buttons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-2 md:px-3 py-2 text-warm-600 dark:text-slate-400 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 hover:scale-105"
              title="Add images"
            >
              <Image className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:inline text-sm font-medium">Photo</span>
            </button>
            
            {shouldShowExpandedForm && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-2 md:px-3 py-2 text-warm-600 dark:text-slate-400 hover:bg-warm-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 hover:scale-105"
              >
                <X className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline text-sm font-medium">Cancel</span>
              </button>
            )}
          </div>

          {/* Right side - Post button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.content.trim() || !formData.categoryId}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transform hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                <span className="hidden sm:inline">Posting...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 md:mr-2" />
                <span className="hidden sm:inline">Post</span>
              </>
            )}
          </button>
        </div>
        </form>
      )}
    </div>
  );
};
