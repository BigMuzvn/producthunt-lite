import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/isAdmin.middleware.js';
import {
  getStats,
  getAllUsers,
  deleteUser,
  toggleAdmin,
  adminDeleteProduct,
  adminDeleteCategory,
  createAdmin,
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

export default router;