import express from "express";
import {
  createTweet,
  getFollowingFeed,
  getMyPosts,
  getPosts,
  likePost,
  unlikePost,
} from "../controller/tweet.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createpost", authMiddleware, createTweet);
router.get("/getposts", authMiddleware, getPosts);
router.get("/followingfeed", authMiddleware, getFollowingFeed);
router.get("/myposts", authMiddleware, getMyPosts);
router.post("/like/:id", authMiddleware, likePost);
router.post("/unlike/:id", authMiddleware, unlikePost);
router.post("/update/:id", authMiddleware, updatePost);
router.post("/delete/:id", authMiddleware, deletePost);
router.post("/comment/:id", authMiddleware, addComment);
router.post("/deletecomment/:id", authMiddleware, deleteComment);
export default router;
