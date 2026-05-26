import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingByPnr,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/pnr/:pnr', getBookingByPnr); // Public lookup for ticket validation
router.post('/:id/cancel', protect, cancelBooking);

export default router;
