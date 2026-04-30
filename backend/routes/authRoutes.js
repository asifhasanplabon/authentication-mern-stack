import express from "express";
import { forgotPassword, getMe, login, register, resendOtp, resetPassword, verifyOtp } from "../controllers/authController.js";
import upload from '../middleware/uploadMiddleware.js';
import {protect} from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword)
router.get('/me',protect, getMe);

export default router;
