import { useState, useEffect } from "react";
import * as notificationApi from "../api/notification.api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getUserNotifications();
      setNotifications(data.notifications);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationApi.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      // Update unread count if the deleted notification was unread
      const notification = notifications.find(
        (n) => n._id === notificationId
      );
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    fetchUnreadCount,
  };
};
