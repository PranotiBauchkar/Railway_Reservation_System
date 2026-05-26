import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Payment from '../models/Payment.js';
import QRCode from 'qrcode';

// Helper to generate 10-digit unique PNR
const generatePNR = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// @desc    Create a new booking & process simulated payment
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { trainId, passengers, journeyDate, totalFare, paymentMethod } = req.body;

  try {
    if (!passengers || passengers.length === 0) {
      res.status(400);
      return res.json({ message: 'No passengers provided' });
    }

    const train = await Train.findById(trainId);
    if (!train) {
      res.status(404);
      return res.json({ message: 'Train not found' });
    }

    // Verify seat availability for selected class
    const seatClass = passengers[0].seatClass;
    const requiredSeats = passengers.length;
    const available = train.availableSeats.get(seatClass);

    if (available === undefined) {
      res.status(400);
      return res.json({ message: `Invalid seat class: ${seatClass}` });
    }

    if (available < requiredSeats) {
      res.status(400);
      return res.json({ message: `Insufficient seats available in ${seatClass}. Available: ${available}` });
    }

    // Generate unique PNR
    const pnr = generatePNR();

    // Generate QR Code
    const qrDataString = `PNR: ${pnr}\nTrain: ${train.trainName} (${train.trainNumber})\nJourney: ${train.source} to ${train.destination}\nDate: ${new Date(journeyDate).toDateString()}\nPassengers: ${requiredSeats}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrDataString);

    // Extract seat numbers
    const seatNumbers = passengers.map((p) => p.seatNumber);

    // Create the booking
    const booking = await Booking.create({
      userId: req.user._id,
      trainId,
      passengers,
      journeyDate,
      seatNumbers,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid', // Instant auto-payment capture for UX
      totalFare,
      PNR: pnr,
      QRCode: qrCodeDataUrl,
    });

    // Deduct seats from train available seats
    train.availableSeats.set(seatClass, available - requiredSeats);
    await train.save();

    // Record the payment
    const transactionId = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    await Payment.create({
      bookingId: booking._id,
      transactionId,
      amount: totalFare,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: 'succeeded',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('trainId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get booking by PNR
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
export const getBookingByPnr = async (req, res) => {
  try {
    const booking = await Booking.findOne({ PNR: req.params.pnr })
      .populate('trainId')
      .populate('userId', 'fullName email phone');

    if (booking) {
      res.json(booking);
    } else {
      res.status(404);
      return res.json({ message: 'No ticket found with this PNR number' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Cancel booking with refund logic
// @route   POST /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return res.json({ message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      return res.json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      res.status(400);
      return res.json({ message: 'Booking is already cancelled' });
    }

    const train = await Train.findById(booking.trainId);
    if (train) {
      // Re-add seats back to the train
      const seatClass = booking.passengers[0].seatClass;
      const count = booking.passengers.length;
      const available = train.availableSeats.get(seatClass);

      train.availableSeats.set(seatClass, available + count);
      await train.save();
    }

    // Update booking status to cancelled & refunded
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Update payment record to refunded
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment) {
      payment.paymentStatus = 'refunded';
      await payment.save();
    }

    res.json({
      message: 'Booking cancelled successfully. Refund of ₹' + booking.totalFare + ' initiated to your payment source.',
      booking,
    });
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};
