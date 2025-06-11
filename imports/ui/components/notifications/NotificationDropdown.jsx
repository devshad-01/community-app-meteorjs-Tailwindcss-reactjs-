import React from "react";
import { useTracker } from "meteor/react-meteor-data"
import { Meteor } from "meteor/meteor"
import { useNavigate } from "react-router-dom"
import { Bell, MessageSquare, Heart, User, FileText, Clock } from "lucide-react"
import { NotificationsCollection } from "/imports/api/notifications"

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const { notifications, unreadCount, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("userNotifications")
    const notificationsList = NotificationsCollection.find(
      { userId: Meteor.userId() },
      {
        sort: { createdAt: -1 },
        limit: 20,
      },
    ).fetch()

    const unread = NotificationsCollection.find({
      userId: Meteor.userId(),
      read: false,
    }).count()

    return {
      notifications: notificationsList,
      unreadCount: unread,
      isLoading: !handle.ready(),
    }
  }, [])

  const handleMarkAsRead = (notificationId) => {
    if (notificationId) {
      Meteor.call("notifications.markAsRead", notificationId, (error) => {
        if (error) {
          console.error("Error marking notification as read:", error)
        }
      })
    }
  }

  const handleMarkAllAsRead = () => {
    Meteor.call("notifications.markAllAsRead", (error) => {
      if (error) {
        console.error("Error marking all notifications as read:", error)
      }
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_POST":
        return <FileText className="w-4 h-4 text-blue-400" />
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4 text-green-400" />
      case "NEW_REPLY":
        return <MessageSquare className="w-4 h-4 text-purple-400" />
      case "POST_LIKED":
        return <Heart className="w-4 h-4 text-red-400" />
      case "MENTION":
        return <User className="w-4 h-4 text-yellow-400" />
      default:
        return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification._id)
    }

    // Navigate to relevant page based on notification type
    try {
      switch (notification.type) {
        case "NEW_POST":
        case "POST_LIKED":
          if (notification.relatedId) {
            navigate(`/forum/post/${notification.relatedId}`)
          }
          break
        case "NEW_REPLY":
        case "MENTION":
          if (notification.relatedType === "post" && notification.data?.postId) {
            navigate(`/forums${notification.data.postId}`)
          } else if (notification.relatedType === "reply" && notification.data?.postId) {
            navigate(`/forum/post/${notification.data.postId}`)
          } else if (notification.relatedType === "message") {
            navigate("/messages") // Navigate to forum and open chat
          }
          break
        case "NEW_MESSAGE":
          navigate("/forum") // Navigate to forum page where chat can be opened
          break
        default:
          console.log("Unknown notification type:", notification.type)
      }
    } catch (error) {
      console.error("Navigation error:", error)
    }

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute -right-3/4   mt-2 w-80 sm:w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 transform origin-top-right transition-all duration-200 animate-in fade-in-0 zoom-in-95">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded-md hover:bg-slate-700/50"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-3 hover:bg-slate-750 cursor-pointer border-l-4 transition-all duration-200 ${
                  !notification.read ? "border-blue-500 bg-slate-750/50" : "border-transparent"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5 p-2 rounded-full bg-slate-700/50">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !notification.read ? "font-medium text-white" : "text-slate-300"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center text-slate-400">
            <div className="bg-slate-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs text-slate-500 mt-1">We'll notify you when something happens</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-750">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-2 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors py-1 hover:bg-slate-700/50 rounded-md"
          >
            <span>View all notifications</span>
          </button>
        </div>
      )}
    </div>
  )
}
