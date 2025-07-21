import express from "express";
import { createTweet, validateTweet } from "../controller/tweet.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/tweets", authMiddleware, validateTweet, createTweet);

export default router;