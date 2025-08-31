import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  updateProfile,
  updateBio,
  getBio,
  getSuggestedUsers,
  followUser,
  unfollowUser,
  getMyProfile,
  getOtherUserProfile,
  searchUsers,
  getUserFollowers,
  getUserFollowing,
  getAllUsers,
} from "../controller/user.controller.js";
import { searchResult } from "../controller/search.controller.js";
const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/bio", authMiddleware, updateBio);
router.get("/bio", authMiddleware, getBio);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/search", authMiddleware, searchUsers);
router.get("/profile/:username", authMiddleware, getOtherUserProfile);
router.get("/otherprofile/:username", authMiddleware, getOtherUserProfile);
router.get("/:userId/followers", authMiddleware, getUserFollowers);
router.get("/:userId/following", authMiddleware, getUserFollowing);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.post("/search", authMiddleware, searchResult);
router.get("/all", authMiddleware, adminOnly, getAllUsers);

export default router;
