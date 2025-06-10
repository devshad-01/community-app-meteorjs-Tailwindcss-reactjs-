import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { 
  User, 
  Mail, 
  Settings, 
  Save, 
  Eye, 
  EyeOff, 
  Camera, 
  MapPin, 
  Globe, 
  FileText,
  Edit2,
  X,
  Upload,
  Check
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserMethods } from '/imports/api/users';
import { useToastContext } from '../components/common/ToastProvider';
import { UserAvatar } from '../components/common/UserAvatar';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmailActions, setShowEmailActions] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || '',
    avatar: null
  });
  
  const [usernameData, setUsernameData] = useState({
    username: user?.username || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUsernameChange = (e) => {
    setUsernameData({ username: e.target.value });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Invalid File', 'Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('File Too Large', 'Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setFormData(prev => ({ ...prev, avatar: imageData }));
      setAvatarPreview(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve, reject) => {
        Meteor.call(UserMethods.updateProfile, formData, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      
      setIsEditing(false);
      setAvatarPreview(null);
      success('Profile Updated!', 'Your profile has been updated successfully');
    } catch (error) {
      showError('Error', error.reason || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!usernameData.username.trim()) {
      showError('Invalid Username', 'Username cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve, reject) => {
        Meteor.call(UserMethods.updateUsername, usernameData.username.trim(), (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      
      setIsEditingUsername(false);
      success('Username Updated!', 'Your username has been updated successfully');
    } catch (error) {
      showError('Error', error.reason || 'Failed to update username');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendVerificationEmail = () => {
    Meteor.call(UserMethods.sendVerificationEmail, (error) => {
      if (error) {
        showError('Error', error.reason || 'Failed to send verification email');
      } else {
        success('Email Sent!', 'Verification email sent successfully');
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingUsername(false);
    setFormData({
      name: user?.profile?.name || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
      avatar: null
    });
    setUsernameData({ username: user?.username || '' });
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update form data when user data changes
  React.useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.profile?.name || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        website: user.profile?.website || '',
        avatar: null
      });
      setUsernameData({ username: user.username || '' });
    }
  }, [user, isEditing]);

  const getUserAvatar = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.profile?.avatar) return user.profile.avatar;
    return null;
  };

  // Helper functions for user roles and colors
  const getUserRole = (userId) => {
    const userData = userId ? Meteor.users.findOne(userId) : user;
    return userData?.profile?.role || 'member';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'red',
      'member': 'purple'
    };
    return colors[role] || 'purple';
  };

  const getUserInitial = () => {
    if (user?.profile?.name) {
      return user.profile.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.emails?.[0]?.address) {
      return user.emails[0].address.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <UserAvatar 
              user={user}
              size="2xl"
              showTooltip={true}
              getRoleColor={getRoleColor}
              getUserRole={getUserRole}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {user?.profile?.name || user?.username || 'User Profile'}
              </h1>
              <p className="text-warm-600 dark:text-slate-400 mt-1">
                @{user?.username || 'username'}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Manage your account settings and personal information
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-warm-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-warm-200 dark:border-slate-700 bg-gradient-to-r from-warm-500/5 to-orange-500/5 dark:from-warm-500/10 dark:to-orange-500/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
                    <User className="mr-3 h-5 w-5 text-warm-600 dark:text-warm-400" />
                    Profile Information
                  </h2>
                  <button
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isEditing 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        : 'bg-warm-500 text-white hover:bg-warm-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Avatar Upload */}
                {isEditing && (
                  <div className="text-center">
                    <div className="relative inline-block">
                      {getUserAvatar() ? (
                        <img
                          src={getUserAvatar()}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-warm-200 dark:border-slate-600"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-warm-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-warm-200 dark:border-slate-600">
                          {getUserInitial()}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-warm-500 text-white p-2 rounded-full hover:bg-warm-600 transition-colors duration-200 shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                      Click the camera icon to upload a new profile picture
                    </p>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-warm-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <p className="text-slate-900 dark:text-white py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                        {user?.profile?.name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Role (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Role
                    </label>
                    <div className="py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        user?.profile?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {user?.profile?.role || 'member'}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-warm-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-slate-900 dark:text-white py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                        {user?.profile?.location || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-warm-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                        {user?.profile?.website ? (
                          <a 
                            href={user.profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-warm-600 dark:text-warm-400 hover:underline"
                          >
                            {user.profile.website}
                          </a>
                        ) : (
                          <span className="text-slate-900 dark:text-white">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-warm-400 focus:border-transparent dark:bg-slate-700 dark:text-white resize-vertical"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg min-h-[100px]">
                      <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                        {user?.profile?.bio || 'No bio provided'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Member Since
                  </label>
                  <p className="text-slate-900 dark:text-white py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-6 border-t border-warm-200 dark:border-slate-700">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center px-6 py-3 bg-warm-500 text-white rounded-lg hover:bg-warm-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-3 border border-warm-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-warm-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Username Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-warm-200 dark:border-slate-700">
              <div className="p-6 border-b border-warm-200 dark:border-slate-700 bg-gradient-to-r from-warm-500/5 to-orange-500/5 dark:from-warm-500/10 dark:to-orange-500/10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Username
                  </h3>
                  <button
                    onClick={() => isEditingUsername ? handleCancel() : setIsEditingUsername(true)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isEditingUsername 
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        : 'bg-warm-500 text-white hover:bg-warm-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isEditingUsername ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Change
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isEditingUsername ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      New Username
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={usernameData.username}
                        onChange={handleUsernameChange}
                        className="flex-1 px-4 py-3 border border-warm-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-warm-500 dark:focus:ring-warm-400 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Enter new username"
                      />
                      <button
                        onClick={handleUsernameUpdate}
                        disabled={isSaving}
                        className="flex items-center px-6 py-3 bg-warm-500 text-white rounded-lg hover:bg-warm-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                      >
                        {isSaving ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Current Username
                    </label>
                    <p className="text-lg font-mono text-slate-900 dark:text-white py-3 px-4 bg-warm-50 dark:bg-slate-700 rounded-lg">
                      @{user?.username || 'No username set'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Security */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-warm-200 dark:border-slate-700">
              <div className="p-6 border-b border-warm-200 dark:border-slate-700 bg-gradient-to-r from-warm-500/5 to-orange-500/5 dark:from-warm-500/10 dark:to-orange-500/10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-warm-600 dark:text-warm-400" />
                    Account Security
                  </h3>
                  <button
                    onClick={() => setShowEmailActions(!showEmailActions)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                  >
                    {showEmailActions ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between p-3 bg-warm-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-slate-900 dark:text-white text-sm">
                      {user?.emails?.[0]?.address || 'Not provided'}
                    </span>
                    {user?.emails?.[0]?.verified ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                {showEmailActions && (
                  <div className="space-y-3 pt-4 border-t border-warm-200 dark:border-slate-700">
                    {!user?.emails?.[0]?.verified && (
                      <button
                        onClick={handleSendVerificationEmail}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all duration-200"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Verification Email
                      </button>
                    )}
                    
                    <button
                      onClick={() => showError('Not Implemented', 'Password reset functionality will be implemented soon')}
                      className="w-full px-4 py-3 border border-warm-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-warm-50 dark:hover:bg-slate-700 font-medium transition-all duration-200"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Accounts */}
            {(user?.services?.google || user?.services?.facebook || user?.services?.github) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-warm-200 dark:border-slate-700">
                <div className="p-6 border-b border-warm-200 dark:border-slate-700 bg-gradient-to-r from-warm-500/5 to-orange-500/5 dark:from-warm-500/10 dark:to-orange-500/10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Connected Accounts
                  </h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {user?.services?.google && (
                    <div className="flex items-center justify-between p-3 bg-warm-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-500 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Google</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{user.services.google.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Connected</span>
                    </div>
                  )}
                  {user?.services?.facebook && (
                    <div className="flex items-center justify-between p-3 bg-warm-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Facebook</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{user.services.facebook.name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Connected</span>
                    </div>
                  )}
                  {user?.services?.github && (
                    <div className="flex items-center justify-between p-3 bg-warm-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-800 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">GitHub</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{user.services.github.username}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Connected</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};