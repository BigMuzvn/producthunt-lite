import express from 'express';
import { register, login, verifyOtp, resendOtp, forgotPassword, resetPassword, changePassword, changeName, changeEmail, deleteAccount } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter, otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/resend-otp', otpRequestLimiter, resendOtp);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.put('/change-name', protect, changeName);
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, changeEmail);
router.delete('/delete-account', protect, deleteAccount);

export default router;