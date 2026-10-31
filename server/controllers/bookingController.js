const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const paymentService = require('../services/paymentService');

exports.createBooking = async (req, res, next) => {
  try {
    const { rideId, seatsRequested } = req.body;
    
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, error: 'Ride not found' });
    if (ride.status !== 'active') return res.status(400).json({ success: false, error: 'Ride is no longer active' });
    if (ride.creator.toString() === req.user.id) return res.status(400).json({ success: false, error: 'Cannot book your own ride' });
    if (ride.availableSeats < seatsRequested) return res.status(400).json({ success: false, error: 'Not enough seats available' });

    const existingBooking = await Booking.findOne({ ride: rideId, passenger: req.user.id, status: { $ne: 'cancelled' } });
    if (existingBooking) return res.status(400).json({ success: false, error: 'You have already booked this ride' });

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user.id,
      seatsRequested
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.id })
      .populate({
        path: 'ride',
        populate: { path: 'creator', select: 'name profileImage rating phone' }
      })
      .sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.getRideBookings = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ success: false, error: 'Ride not found' });
    if (ride.creator.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized to view these bookings' });

    const bookings = await Booking.find({ ride: req.params.rideId }).populate('passenger', 'name profileImage rating phone');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    if (booking.ride.creator.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, error: 'Booking is not pending' });
    if (booking.ride.availableSeats < booking.seatsRequested) return res.status(400).json({ success: false, error: 'Not enough seats available' });

    booking.status = 'accepted';
    await booking.save();

    booking.ride.availableSeats -= booking.seatsRequested;
    if (booking.ride.availableSeats === 0) {
      booking.ride.status = 'full';
    }
    await booking.ride.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    if (booking.ride.creator.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, error: 'Booking is not pending' });

    booking.status = 'rejected';
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (booking.passenger.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return res.status(400).json({ success: false, error: 'Booking is already cancelled or rejected' });
    }

    if (booking.status === 'accepted' || booking.status === 'paid') {
      const ride = await Ride.findById(booking.ride._id);
      ride.availableSeats += booking.seatsRequested;
      if (ride.status === 'full') ride.status = 'active';
      await ride.save();
    }

    booking.status = 'cancelled';
    await booking.save();
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.initiatePayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (booking.passenger.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    if (booking.status !== 'accepted') return res.status(400).json({ success: false, error: 'Can only pay for accepted bookings' });

    const amount = booking.ride.pricePerSeat * booking.seatsRequested;
    const order = await paymentService.createOrder(amount, 'INR', booking._id.toString());
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const booking = await Booking.findById(req.params.id).populate('ride');
    
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    
    const isValid = paymentService.verifyPayment(orderId, paymentId, signature);
    if (!isValid) return res.status(400).json({ success: false, error: 'Payment verification failed' });

    const amount = booking.ride.pricePerSeat * booking.seatsRequested;
    booking.status = 'paid';
    booking.paymentDetails = { orderId, paymentId, signature, amount, paidAt: Date.now() };
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
