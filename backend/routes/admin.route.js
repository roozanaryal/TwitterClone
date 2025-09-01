import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getDashboardStats,
  getSystemHealth,
  getUserAnalytics,
  getContentStats
} from "../controller/admin.controller.js";
import {
  toggleAdminStatus,
  deleteUserById,
} from "../controller/user.controller.js";
import {
  getAdBanner,
  updateAdBanner,
  resetAdBanner,
  trackAdClick,
  getAdAnalytics,
  toggleAdStatus
} from "../controller/adBanner.controller.js";

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

// User management actions
router.patch("/users/:id/toggle-admin", toggleAdminStatus);
router.delete("/users/:id", deleteUserById);

// Ad Banner management
router.get("/ad-banner", getAdBanner);
router.put("/ad-banner", updateAdBanner);
router.post("/ad-banner/reset", resetAdBanner);
router.get("/ad-banner/analytics", getAdAnalytics);
router.patch("/ad-banner/toggle", toggleAdStatus);

export default router;
