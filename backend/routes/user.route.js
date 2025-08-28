import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  updateBio,
  getBio,
  getSuggestedUsers,
  followUser,
  unfollowUser,
  getMyProfile,
  getOtherUserProfile,
} from "../controller/user.controller.js";
import { searchResult } from "../controller/search.controller.js";
const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/bio", authMiddleware, updateBio);
router.get("/bio", authMiddleware, getBio);
router.get("/suggested", authMiddleware, getSuggestedUsers);
router.get("/profile/:username", authMiddleware, getMyProfile);
router.get("/otherprofile/:username", authMiddleware, getOtherUserProfile);
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.post("/search", authMiddleware, searchResult);

export default router;
