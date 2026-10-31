const Review = require('../models/Review');
const Ride = require('../models/Ride');
const User = require('../models/User');

const updateAverageRating = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });
  let totalRating = 0;
  reviews.forEach(r => { totalRating += r.rating; });
  
  const avg = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
  
  await User.findOneAndUpdate(
    { _id: userId },
    { rating: avg, totalReviews: reviews.length }
  );
};

exports.createReview = async (req, res, next) => {
  try {
    const { revieweeId, rideId, rating, comment } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, error: 'Ride not found' });
    
    // Check for duplicate review
    const existingReview = await Review.findOne({ reviewer: req.user.id, reviewee: revieweeId, ride: rideId });
    if (existingReview) return res.status(400).json({ success: false, error: 'You have already left a review for this user on this ride' });

    const review = await Review.create({
      reviewer: req.user.id,
      reviewee: revieweeId,
      ride: rideId,
      rating,
      comment
    });

    await updateAverageRating(revieweeId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name profileImage')
      .populate('ride', 'from to date')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.getRideReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ ride: req.params.rideId })
      .populate('reviewer', 'name profileImage')
      .populate('reviewee', 'name profileImage');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    if (review.reviewer.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

    review = await Review.findOneAndUpdate(
      { _id: req.params.id },
      { rating: req.body.rating, comment: req.body.comment },
      { new: true, runValidators: true }
    );

    await updateAverageRating(review.reviewee);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    if (review.reviewer.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

    const revieweeId = review.reviewee;
    await Review.deleteOne({ _id: review._id });
    
    await updateAverageRating(revieweeId);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
