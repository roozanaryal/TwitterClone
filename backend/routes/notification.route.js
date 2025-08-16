import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controller/notification.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a notification (for testing purposes)
router.post("/create", authMiddleware, createNotification);

// Get user notifications
router.get("/", authMiddleware, getUserNotifications);

// Mark a notification as read
router.patch("/mark-read/:id", authMiddleware, markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", authMiddleware, markAllAsRead);

// Delete a notification
router.delete("/:id", authMiddleware, deleteNotification);

// Get unread notifications count
router.get("/unread-count", authMiddleware, getUnreadCount);

export default router;
