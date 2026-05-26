import express from 'express';
import { getMyPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-payments', protect, getMyPayments);

export default router;
