import express from 'express';
import { addReview, getReviewsForTrain } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/train/:trainId', getReviewsForTrain);

export default router;
