import React, { useState, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import { 
  Users, 
  Search, 
  UserCheck,
  Star
} from 'lucide-react';
import { useToastContext } from '../components/common/ToastProvider';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MessageModal } from '../components/common/MessageModal';
import { MemberCard } from '../components/members';
import { useMembers } from '../hooks/useMembers';

export const MembersPage = () => {
  const { success, error: showError } = useToastContext();
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use the custom hook for members data
  const {
    members,
    loading,
    user,
    conversations,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    limit,
    setLimit
  } = useMembers();

  const formatTimeAgo = useCallback((date) => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return dateObj.toLocaleDateString();
  }, []);

  const handleStartChat = useCallback((member) => {
    setSelectedMember(member);
    setShowChat(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setShowChat(false);
    setSelectedMember(null);
  }, []);

  const loadMoreMembers = useCallback(() => {
    setIsLoadingMore(true);
    setLimit(prev => prev + 20);
    setTimeout(() => setIsLoadingMore(false), 1000);
  }, [setLimit]);

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading members..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-warm-600 dark:text-warm-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Community Members
              </h1>
              <span className="text-sm text-slate-500 dark:text-slate-400 bg-warm-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search members by name, username, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-warm-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-warm-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { id: 'all', label: 'All', icon: Users },
                { id: 'online', label: 'Online', icon: UserCheck },
                { id: 'admins', label: 'Admins', icon: Star }
              ].map(filter => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                      selectedFilter === filter.id
                        ? 'bg-warm-500 text-white shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-warm-100 dark:hover:bg-slate-600 border border-warm-200 dark:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard
              key={member._id}
              member={member}
              conversation={conversations.get(member._id)}
              onStartChat={handleStartChat}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>

        {/* Load More Button */}
        {members.length >= limit && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreMembers}
              disabled={isLoadingMore}
              className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-warm-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium border border-warm-200 dark:border-slate-600 transition-all duration-200"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-warm-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Load More Members</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {members.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2">
              No members found
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No members match the selected filter'}
            </p>
          </div>
        )}
      </div>

      {/* Direct Message Modal */}
      <MessageModal
        isOpen={showChat}
        onClose={handleCloseChat}
        selectedMember={selectedMember}
        user={user}
      />
    </div>
  );
};
