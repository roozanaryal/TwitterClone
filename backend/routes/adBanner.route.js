import express from "express";
import { getAdBanner, trackAdClick } from "../controller/adBanner.controller.js";

const router = express.Router();

// Public route - get current ad banner configuration
router.get("/", getAdBanner);

// Public route - track ad clicks
router.post("/click", trackAdClick);

export default router;
