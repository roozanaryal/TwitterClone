import express from "express";
import { login, logout, signup } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Return current user if authenticated
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

export default router;