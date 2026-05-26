import express from 'express';
import { fileComplaint, getMyComplaints } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, fileComplaint);
router.get('/my-complaints', protect, getMyComplaints);

export default router;
