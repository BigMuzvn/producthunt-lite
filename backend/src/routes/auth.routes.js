import express from 'express';
import {
  register, login, verifyOtp, resendOtp, forgotPassword, resetPassword,
  changePassword, changeName, changeEmail, deleteAccount,
  updateProfile, getMakerProfile, toggleBookmark, getBookmarks
} from '../controllers/auth.controller.js';
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

router.put('/profile', protect, updateProfile);
router.get('/maker/:id', getMakerProfile);
router.post('/bookmarks/:productId', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

export default router;