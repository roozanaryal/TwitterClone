import express from "express";
import { createAdminUser, checkUser } from "../controller/debug.controller.js";

const router = express.Router();

router.post("/create-admin", createAdminUser);
router.get("/check-user/:username", checkUser);

export default router;
