import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  validateBookmarkAction,
  validateGetBookmarksQuery,
} from "../controllers/bookmarkController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Routes for bookmark actions
router.post(
  "/bookmarks/:postId",
  authMiddleware,
  validateBookmarkAction,
  addBookmark
);
router.delete(
  "/bookmarks/:postId",
  authMiddleware,
  validateBookmarkAction,
  removeBookmark
);
router.get(
  "/bookmarks",
  authMiddleware,
  validateGetBookmarksQuery,
  getBookmarks
);

export default router;
