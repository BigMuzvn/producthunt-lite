import express from 'express';
import { validateEmail } from '../controllers/util.controller.js';

const router = express.Router();

router.get('/validate-email', validateEmail);

export default router;