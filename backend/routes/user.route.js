import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateBio, getBio } from "../controller/user.controller.js";

const router = express.Router();

router.put("/bio", protectRoute, updateBio);
router.get("/bio", protectRoute, getBio);

export default router;
