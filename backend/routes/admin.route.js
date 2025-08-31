import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getDashboardStats,
  getSystemHealth,
  getUserAnalytics,
  getContentStats
} from "../controller/admin.controller.js";

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminOnly);

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// System health
router.get("/system/health", getSystemHealth);

// User analytics
router.get("/analytics/users", getUserAnalytics);

// Content statistics
router.get("/analytics/content", getContentStats);

export default router;
