import express from 'express';
import {
  getAnalytics,
  getUsers,
  getComplaints,
  getBookings,
  resolveComplaint,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getUsers);
router.get('/complaints', protect, admin, getComplaints);
router.get('/bookings', protect, admin, getBookings);
router.put('/complaints/:id/resolve', protect, admin, resolveComplaint);

export default router;
