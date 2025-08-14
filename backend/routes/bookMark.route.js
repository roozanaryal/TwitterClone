import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controller/bookMark.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for bookmark actions
router.post(
  "/:postId",
  authMiddleware,
  addBookmark
);
router.delete(
  "/:postId",
  authMiddleware,
  removeBookmark
);
router.get(
  "/",
  authMiddleware,
  getBookmarks
);

export default router;
