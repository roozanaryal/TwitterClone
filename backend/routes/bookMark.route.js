import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  validateBookmarkAction,
  validateGetBookmarksQuery,
} from "../controller/bookMark.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for bookmark actions
router.post(
  "/:postId",
  authMiddleware,
  validateBookmarkAction,
  addBookmark
);
router.delete(
  "/:postId",
  authMiddleware,
  validateBookmarkAction,
  removeBookmark
);
router.get(
  "/",
  authMiddleware,
  validateGetBookmarksQuery,
  getBookmarks
);

export default router;
