import express from 'express';
import { getProductComments, createComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/product/:productId', getProductComments);
router.post('/product/:productId', protect, createComment);
router.delete('/:id', protect, deleteComment);

export default router;
