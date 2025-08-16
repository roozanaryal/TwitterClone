import { useState, useEffect, useCallback } from "react";
import useAPICall from "../api/useAPICall";
import { NOTIFICATION_ENDPOINTS } from "../api/notification.api";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const callAPI = useAPICall();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await callAPI(NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS, "GET");
      if (response.success) {
        setNotifications(response.data.notifications);
      }
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [callAPI]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await callAPI(NOTIFICATION_ENDPOINTS.UNREAD_COUNT, "GET");
      if (response.success) {
        setUnreadCount(response.data.count);
      }
      return response;
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      return { success: false, error: err.message };
    }
  }, [callAPI]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await callAPI(NOTIFICATION_ENDPOINTS.MARK_READ(notificationId), "PATCH", {});
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return response;
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      return { success: false, error: err.message };
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await callAPI(NOTIFICATION_ENDPOINTS.MARK_ALL_READ, "PATCH", {});
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
      return response;
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      return { success: false, error: err.message };
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      const response = await callAPI(NOTIFICATION_ENDPOINTS.DELETE(notificationId), "DELETE");
      if (response.success) {
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
      }
      return response;
    } catch (err) {
      console.error("Failed to delete notification:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

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

export default useNotifications;
