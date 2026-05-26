import Complaint from '../models/Complaint.js';

// @desc    Lodge a new support ticket / complaint
// @route   POST /api/complaints
// @access  Private
export const fileComplaint = async (req, res) => {
  const { subject, description } = req.body;

  try {
    if (!subject || !description) {
      res.status(400);
      return res.json({ message: 'Subject and description are required' });
    }

    const complaint = await Complaint.create({
      userId: req.user._id,
      subject,
      description,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get user filed complaints
// @route   GET /api/complaints/my-complaints
// @access  Private
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};
