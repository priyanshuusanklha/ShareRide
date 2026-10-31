const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    required: [true, 'Please add origin (from) address']
  },
  to: {
    type: String,
    required: [true, 'Please add destination (to) address']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  departureTime: {
    type: String,
    required: [true, 'Please add departure time']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please add available seats'],
    min: 1
  },
  pricePerSeat: {
    type: Number,
    required: [true, 'Please add price per seat'],
    min: 0
  },
  vehicle: {
    make: String,
    model: String,
    color: String,
    plateNumber: String
  },
  pickupInstructions: {
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

rideSchema.index({ from: 1, to: 1, date: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
