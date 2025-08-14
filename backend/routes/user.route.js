import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateBio, getBio } from "../controller/user.controller.js";

const router = express.Router();

router.put("/bio", authMiddleware, updateBio);
router.get("/bio", authMiddleware, getBio);

export default router;
