const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getRideBookings, 
  acceptBooking, 
  rejectBooking, 
  cancelBooking, 
  initiatePayment, 
  verifyPayment 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validateBooking, handleValidationErrors } = require('../middleware/validate');

router.post('/', protect, validateBooking, handleValidationErrors, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/ride/:rideId', protect, getRideBookings);
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/reject', protect, rejectBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/pay', protect, initiatePayment);
router.put('/:id/verify-payment', protect, verifyPayment);

module.exports = router;
