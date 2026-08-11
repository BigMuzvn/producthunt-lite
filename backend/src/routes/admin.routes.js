import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/isAdmin.middleware.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  getStats,
  getAllUsers,
  deleteUser,
  toggleAdmin,
  adminDeleteProduct,
  adminDeleteCategory,
  createAdmin,
  updateOwnName,
  requestEmailChangeOtp,
  confirmEmailChange,
  requestPasswordChangeOtp,
  confirmPasswordChange,
  updateOtherAdmin,
  resetOtherAdminPassword,
} from '../controllers/admin.controller.js';


const router = express.Router();

router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-admin', toggleAdmin);
router.delete('/products/:id', adminDeleteProduct);
router.delete('/categories/:id', adminDeleteCategory);
router.post('/create-admin', createAdmin);

// Profil de l'admin connecté
router.put('/profile/name', updateOwnName);
router.post('/profile/email/request-otp', otpRequestLimiter, requestEmailChangeOtp);
router.post('/profile/email/confirm', otpVerifyLimiter, confirmEmailChange);
router.post('/profile/password/request-otp', otpRequestLimiter, requestPasswordChangeOtp);
router.post('/profile/password/confirm', otpVerifyLimiter, confirmPasswordChange);

// Gestion des autres admins (super admin uniquement, vérifié dans le controller)
router.put('/admins/:id', updateOtherAdmin);
router.put('/admins/:id/password', resetOtherAdminPassword);

export default router;