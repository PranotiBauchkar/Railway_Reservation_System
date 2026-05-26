import Review from '../models/Review.js';
import Train from '../models/Train.js';

// @desc    Add review for a train
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  const { trainId, rating, comment } = req.body;

  try {
    const train = await Train.findById(trainId);

    if (!train) {
      res.status(404);
      return res.json({ message: 'Train not found' });
    }

    const review = await Review.create({
      userId: req.user._id,
      trainId,
      rating: Number(rating),
      comment,
    });

    // Recalculate train ratings average
    const trainReviews = await Review.find({ trainId });
    const totalRating = trainReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / trainReviews.length;

    train.ratings = Number(avgRating.toFixed(1));
    await train.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Get reviews for a train
// @route   GET /api/reviews/train/:trainId
// @access  Public
export const getReviewsForTrain = async (req, res) => {
  try {
    const reviews = await Review.find({ trainId: req.params.trainId })
      .populate('userId', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500);
    return res.json({ message: error.message });
  }
};
