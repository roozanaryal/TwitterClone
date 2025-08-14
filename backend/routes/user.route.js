import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateBio, getBio, getSuggestedUsers, getUserProfile } from "../controller/user.controller.js";

const router = express.Router();

router.put("/bio", authMiddleware, updateBio);
router.get("/bio", authMiddleware, getBio);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/profile/:username", authMiddleware, getUserProfile);

export default router;
