// Notification API endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: "notifications",
  MARK_READ: (id) => `notifications/mark-read/${id}`,
  MARK_ALL_READ: "notifications/mark-all-read",
  DELETE: (id) => `notifications/${id}`,
  UNREAD_COUNT: "notifications/unread-count"
};
