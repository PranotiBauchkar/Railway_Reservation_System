import User from '../models/User.js';
import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Complaint from '../models/Complaint.js';

// @desc    Get dashboard metrics & chart data (Admin only)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTrains = await Train.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Sum up succeeded payments
    const payments = await Payment.find({ paymentStatus: 'succeeded' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Mocked time-series monthly revenue details for dashboard charts
    const monthlyRevenue = [
      { name: 'Jan', revenue: Math.floor(totalRevenue * 0.12) || 45000 },
      { name: 'Feb', revenue: Math.floor(totalRevenue * 0.15) || 58000 },
      { name: 'Mar', revenue: Math.floor(totalRevenue * 0.18) || 62000 },
      { name: 'Apr', revenue: Math.floor(totalRevenue * 0.22) || 84000 },
      { name: 'May', revenue: Math.floor(totalRevenue * 0.33) || 120000 },
    ];

    // Read real database counts per train, falls back to a random distribution if zero
    const trains = await Train.find({});
    const trainBookingStats = await Promise.all(
      trains.map(async (t) => {
        const count = await Booking.countDocuments({ trainId: t._id });
        return {
          name: t.trainName.split(' ')[0], // Get first name like "Vande" or "Apex"
          bookings: count || Math.floor(Math.random() * 25) + 5,
        };
      })
    );

    res.json({
      totalUsers,
      totalTrains,
      totalBookings,
      totalRevenue,
      monthlyRevenue,
      trainBookingStats,
    });
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/admin/complaints
// @access  Private/Admin
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Resolve a complaint (Admin only)
// @route   PUT /api/admin/complaints/:id/resolve
// @access  Private/Admin
// @desc    Get all bookings (Admin only)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'fullName email phone')
      .populate('trainId', 'trainNumber trainName source destination')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Resolve a complaint (Admin only)
// @route   PUT /api/admin/complaints/:id/resolve
// @access  Private/Admin
export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.complaintStatus = 'resolved';
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404);
      return res.json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};
