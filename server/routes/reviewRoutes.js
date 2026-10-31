const express = require('express');
const router = express.Router();
const { createReview, getUserReviews, getRideReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validateReview, handleValidationErrors } = require('../middleware/validate');

router.post('/', protect, validateReview, handleValidationErrors, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/ride/:rideId', getRideReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
