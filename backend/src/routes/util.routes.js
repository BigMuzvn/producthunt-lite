import express from 'express';
import { validateEmail, getPublicStats } from '../controllers/util.controller.js';

const router = express.Router();

router.get('/stats', getPublicStats);
router.get('/validate-email', validateEmail);

export default router;