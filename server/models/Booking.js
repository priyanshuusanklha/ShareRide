const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ride',
    required: true
  },
  passenger: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seatsRequested: {
    type: Number,
    required: [true, 'Please specify number of seats'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'paid'],
    default: 'pending'
  },
  paymentDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    paidAt: Date
  }
}, {
  timestamps: true
});

bookingSchema.index({ ride: 1, passenger: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
