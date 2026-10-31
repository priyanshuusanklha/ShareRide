const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ride',
    required: true
  },
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  }
}, {
  timestamps: true
});

chatSchema.index({ participants: 1, ride: 1 });

module.exports = mongoose.model('Chat', chatSchema);
