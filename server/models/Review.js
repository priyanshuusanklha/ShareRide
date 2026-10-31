const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  ride: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ride',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

reviewSchema.index({ reviewer: 1, reviewee: 1, ride: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
