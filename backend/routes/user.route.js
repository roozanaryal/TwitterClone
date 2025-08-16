import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateBio, getBio, getSuggestedUsers, getUserProfile, followUser, unfollowUser } from "../controller/user.controller.js";

const router = express.Router();

router.put("/bio", authMiddleware, updateBio);
router.get("/bio", authMiddleware, getBio);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/profile/:username", authMiddleware, getUserProfile);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);

export default router;
