import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// @desc    Get user payment history
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    const bookingIds = bookings.map((b) => b._id);

    const payments = await Payment.find({ bookingId: { $in: bookingIds } })
      .populate({
        path: 'bookingId',
        populate: { path: 'trainId', select: 'trainNumber trainName source destination' }
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};
