import express from 'express';
import { register, login, verifyOtp, resendOtp, forgotPassword, resetPassword, changePassword, changeEmail, deleteAccount } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);
router.put('/change-email', protect, changeEmail);
router.delete('/delete-account', protect, deleteAccount);
export default router;