import express from "express";
import { verifyEsewaPayment, getPaymentHistory } from "../controller/payment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Verify eSewa payment
router.post("/verify-esewa", authMiddleware, verifyEsewaPayment);

// Get payment history
router.get("/history", authMiddleware, getPaymentHistory);

export default router;
