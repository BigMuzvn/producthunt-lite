import express from 'express';
import { getProducts, getProductById, createProduct, voteProduct, unvoteProduct, getMyProducts, updateProduct, deleteProduct, getMyVotes } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/my-votes', protect, getMyVotes);
router.get('/mine', protect, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.post('/:id/vote', protect, voteProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.delete('/:id/vote', protect, unvoteProduct);

export default router;