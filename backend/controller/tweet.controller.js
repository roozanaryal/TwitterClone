import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// Input validation middleware
const validateTweet = [
  body("description")
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage("Description must be between 1 and 280 characters")
    .matches(/^(?!\s*$).+/)
    .withMessage("Description cannot be empty or just whitespace")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage("Content must be between 1 and 280 characters")
    .matches(/^(?!\s*$).+/)
    .withMessage("Content cannot be empty or just whitespace")
    .escape(),
];

const validatePostsQuery = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be an integer between 1 and 50")
    .toInt(),
  query("cursor")
    .optional()
    .isISO8601()
    .withMessage("Cursor must be a valid ISO 8601 date")
    .toDate(),
  query("section")
    .optional()
    .isIn(["foryou", "explore"])
    .withMessage("Section must be either 'foryou' or 'explore'"),
];

// Validation middleware for query parameters
const validateFollowingFeedQuery = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be an integer between 1 and 50")
    .toInt(),
  query("cursor")
    .optional()
    .isISO8601()
    .withMessage("Cursor must be a valid ISO 8601 date")
    .toDate(),
];

// Validation middleware for query parameters
const validateMyPostsQuery = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be an integer between 1 and 50")
    .toInt(),
  query("cursor")
    .optional()
    .isISO8601()
    .withMessage("Cursor must be a valid ISO 8601 date")
    .toDate(),
];

// Create Tweet Controller for creating a new tweet
export const createTweet = [
  validateTweet,
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { description, content } = req.body;
    const userId = req.user.id; // Assumes auth middleware sets req.user

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    try {
      // Create new post
      const newPost = new Post({
        postOwner: userId,
        description,
        content,
        likes: [],
        comments: [],
        createdAt: new Date(),
      });

      // Save post
      const savedPost = await newPost.save();

      // Update user's posts array
      await User.findByIdAndUpdate(userId, {
        $push: { posts: savedPost._id },
      });

      // Populate postOwner details
      const populatedTweet = await Post.findById(savedPost._id)
        .populate("postOwner", "username name profilePicture")
        .exec();

      return res.status(201).json({
        success: true,
        message: "Tweet created successfully",
        tweet: populatedTweet,
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Invalid post data",
          error: error.message,
        });
      }

      // Handle general errors
      return res.status(500).json({
        success: false,
        message: "Server error while creating tweet",
        error: error.message,
      });
    }
  }),
];

// Get Posts Controller For For You and Explore
export const getPosts = [
  validatePostsQuery,
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From auth middleware
    const { cursor, limit = 20, section = "foryou" } = req.query;

    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build query for posts
      const query = {};
      if (cursor) {
        query.createdAt = { $lt: new Date(cursor) }; // Fetch posts older than cursor
      }

      // Fetch posts, sorted by createdAt descending
      const posts = await Post.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit)
        .populate("postOwner", "username name profilePicture")
        .exec();

      // Get the cursor for the next page (if there are more posts)
      const nextCursor =
        posts.length === limit
          ? posts[posts.length - 1].createdAt.toISOString()
          : null;

      // Optionally: Customize query based on section
      // For "Explore", you could add logic to filter trending posts (e.g., by likes or comments)
      if (section === "explore") {
        // Example: Prioritize posts with more likes (optional, can be customized)
        // Currently, same as "foryou" for simplicity
      }

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        posts,
        nextCursor,
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          error: error.message,
        });
      }

      // Handle general errors
      return res.status(500).json({
        success: false,
        message: "Server error while fetching posts",
        error: error.message,
      });
    }
  }),
];

// Controller to fetch posts from followed users
export const getFollowingFeed = [
  validateFollowingFeedQuery,
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From auth middleware
    const { cursor, limit = 20 } = req.query;

    try {
      // Verify user exists and get their following list
      const user = await User.findById(userId).select("following");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Include user's own posts and posts from followed users
      const followedUsers = [...user.following, userId];

      // Build query for posts
      const query = {
        postOwner: { $in: followedUsers }, // Filter by followed users and self
      };
      if (cursor) {
        query.createdAt = { $lt: new Date(cursor) }; // Fetch posts older than cursor
      }

      // Fetch posts, sorted by createdAt descending
      const posts = await Post.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit)
        .populate("postOwner", "username name profilePicture")
        .exec();

      // Get the cursor for the next page (if there are more posts)
      const nextCursor =
        posts.length === limit
          ? posts[posts.length - 1].createdAt.toISOString()
          : null;

      // Handle empty feed case
      if (posts.length === 0 && !cursor) {
        return res.status(200).json({
          success: true,
          message: "No posts available. Try following some users!",
          posts: [],
          nextCursor: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Following feed fetched successfully",
        posts,
        nextCursor,
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          error: error.message,
        });
      }

      // Handle general errors
      return res.status(500).json({
        success: false,
        message: "Server error while fetching following feed",
        error: error.message,
      });
    }
  }),
];

// Controller to fetch posts from the logged-in user
export const getMyPosts = [
  validateMyPostsQuery,
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From auth middleware
    const { cursor, limit = 20 } = req.query;

    try {
      // Verify user exists
      const user = await User.findById(userId).select("_id");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build query for posts
      const query = { postOwner: userId }; // Filter by logged-in user
      if (cursor) {
        query.createdAt = { $lt: new Date(cursor) }; // Fetch posts older than cursor
      }

      // Fetch posts, sorted by createdAt descending
      const posts = await Post.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit)
        .populate("postOwner", "username name profilePicture")
        .exec();

      // Get the cursor for the next page (if there are more posts)
      const nextCursor =
        posts.length === limit
          ? posts[posts.length - 1].createdAt.toISOString()
          : null;

      // Handle empty posts case
      if (posts.length === 0 && !cursor) {
        return res.status(200).json({
          success: true,
          message: "No posts available. Create your first post!",
          posts: [],
          nextCursor: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        posts,
        nextCursor,
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          error: error.message,
        });
      }

      // Handle general errors
      return res.status(500).json({
        success: false,
        message: "Server error while fetching posts",
        error: error.message,
      });
    }
  }),
];
