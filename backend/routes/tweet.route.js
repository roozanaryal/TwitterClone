import express from "express";
import {
  createTweet,
  getFollowingFeed,
  getMyPosts,
  getPosts,
  validateTweet,
  validatePostsQuery,
  validateFollowingFeedQuery,
  validateMyPostsQuery
} from "../controller/tweet.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createpost", authMiddleware, validateTweet, createTweet);
router.get("/getposts", authMiddleware, validatePostsQuery, getPosts);
router.get(
  "/followingfeed",
  authMiddleware,
  validateFollowingFeedQuery,
  getFollowingFeed
);
router.get("/myposts", authMiddleware, validateMyPostsQuery, getMyPosts);

export default router;
