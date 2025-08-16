import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get user notifications
export const getUserNotifications = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark a notification as read
export const markAsRead = async (notificationId) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/notifications/mark-read/${notificationId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/api/notifications/mark-all-read`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/api/notifications/${notificationId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Get unread notifications count
export const getUnreadCount = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    throw error;
  }
};
