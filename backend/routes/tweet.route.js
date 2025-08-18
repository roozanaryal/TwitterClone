import express from "express";
import {
  createTweet,
  getFollowingFeed,
  getMyPosts,
  getPosts,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getOtherUserPosts,
} from "../controller/tweet.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createpost", authMiddleware, createTweet);
router.get("/getmyposts", authMiddleware, getMyPosts);
router.get("/followingfeed", authMiddleware, getFollowingFeed);
router.get("/getposts", authMiddleware, getPosts);
router.get("/user/:userId", authMiddleware, getOtherUserPosts);

router.post("/like/:id", authMiddleware, likePost);
router.post("/unlike/:id", authMiddleware, unlikePost);
router.post("/update/:id", authMiddleware, updatePost);

router.delete("/delete/:id", authMiddleware, deletePost);
router.post("/comment/:id", authMiddleware, addComment);
router.delete("/deletecomment/:id", authMiddleware, deleteComment);

export default router;
