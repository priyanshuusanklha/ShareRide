const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('phone', 'Phone number is required').notEmpty()
];

exports.validateLogin = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
];

exports.validateRide = [
  body('from', 'Origin (from) is required').notEmpty(),
  body('to', 'Destination (to) is required').notEmpty(),
  body('date', 'Valid date is required').isISO8601(),
  body('departureTime', 'Departure time is required').notEmpty(),
  body('availableSeats', 'Available seats must be at least 1').isInt({ min: 1 }),
  body('pricePerSeat', 'Price per seat must be a positive number').isFloat({ min: 0 })
];

exports.validateBooking = [
  body('rideId', 'Valid ride ID is required').isMongoId(),
  body('seatsRequested', 'Requested seats must be at least 1').isInt({ min: 1 })
];

exports.validateReview = [
  body('revieweeId', 'Valid reviewee ID is required').isMongoId(),
  body('rideId', 'Valid ride ID is required').isMongoId(),
  body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
];

exports.validateMessage = [
  body('content', 'Message content is required').notEmpty()
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
