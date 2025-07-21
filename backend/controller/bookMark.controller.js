import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { param, query, validationResult } from "express-validator";

// Validation middleware for bookmark actions
const validateBookmarkAction = [
  param("postId")
    .isMongoId()
    .withMessage("Invalid post ID"),
];

const validateGetBookmarksQuery = [
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

// Add a post to bookmarks
export const addBookmark = [
  validateBookmarkAction,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From auth middleware
    const { postId } = req.params;

    try {
      // Verify user exists
      const user = await User.findById(userId).select("bookmarks");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if already bookmarked
      if (user.bookmarks.includes(postId)) {
        return res.status(400).json({
          success: false,
          message: "Post already bookmarked",
        });
      }

      // Add to bookmarks
      await User.findByIdAndUpdate(userId, {
        $push: { bookmarks: postId },
      });

      return res.status(200).json({
        success: true,
        message: "Post bookmarked successfully",
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID",
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error while bookmarking post",
        error: error.message,
      });
    }
  }),
];

// Remove a post from bookmarks
export const removeBookmark = [
  validateBookmarkAction,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user.id; // From auth middleware
    const { postId } = req.params;

    try {
      // Verify user exists
      const user = await User.findById(userId).select("bookmarks");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if post is bookmarked
      if (!user.bookmarks.includes(postId)) {
        return res.status(400).json({
          success: false,
          message: "Post not found in bookmarks",
        });
      }

      // Remove from bookmarks
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: postId },
      });

      return res.status(200).json({
        success: true,
        message: "Post removed from bookmarks",
      });
    } catch (error) {
      // Handle specific errors
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID",
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error while removing bookmark",
        error: error.message,
      });
    }
  }),
];

// Fetch bookmarked posts
export const getBookmarks = [
  validateGetBookmarksQuery,
  asyncHandler(async (req, res) => {
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
      // Verify user exists and get bookmarks
      const user = await User.findById(userId).select("bookmarks");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build query for bookmarked posts
      const query = { _id: { $in: user.bookmarks } };
      if (cursor) {
        query.createdAt = { $lt: new Date(cursor) }; // Fetch posts older than cursor
      }

      // Fetch posts, sorted by createdAt descending
      const posts = await Post.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .limit(limit)
        .populate("postOwner", "username name profilePicture")
        .exec();

      // Get the cursor for the next page
      const nextCursor = posts.length === limit ? posts[posts.length - 1].createdAt.toISOString() : null;

      // Handle empty bookmarks case
      if (posts.length === 0 && !cursor) {
        return res.status(200).json({
          success: true,
          message: "No bookmarked posts available",
          posts: [],
          nextCursor: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Bookmarked posts fetched successfully",
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

      return res.status(500).json({
        success: false,
        message: "Server error while fetching bookmarked posts",
        error: error.message,
      });
    }
  }),
];

// Export as an object for modularity
// export default { addBookmark, removeBookmark, getBookmarks, validateBookmarkAction, validateGetBookmarksQuery };