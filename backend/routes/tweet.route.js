import express from "express";
import {
  createTweet,
  getFollowingFeed,
  getMyPosts,
  getPosts,
} from "../controller/tweet.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createpost", authMiddleware, createTweet);
router.get("/getposts", authMiddleware, getPosts);
router.get("/followingfeed", authMiddleware, getFollowingFeed);
router.get("/myposts", authMiddleware, getMyPosts);

export default router;
