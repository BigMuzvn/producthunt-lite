import express from 'express';
import { getCategories, createCategory } from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { categoryCreateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, categoryCreateLimiter, createCategory);

export default router;