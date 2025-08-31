import express from "express";
import { getAdBanner, updateAdBanner, resetAdBanner } from "../controller/adBanner.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public route - get current ad banner configuration
router.get("/", getAdBanner);

// Admin routes - require authentication and admin privileges
router.put("/update",authMiddleware,  adminOnly, updateAdBanner);
router.post("/reset",authMiddleware, adminOnly, resetAdBanner);

export default router;
