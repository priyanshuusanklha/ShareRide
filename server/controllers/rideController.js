const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

exports.createRide = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;
    const ride = await Ride.create(req.body);
    res.status(201).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.getRides = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'minSeats', 'maxPrice'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let parsedQuery = JSON.parse(queryStr);
    parsedQuery.status = 'active';

    if (req.user) {
      parsedQuery.creator = { $ne: req.user.id };
    }

    if (req.query.minSeats) {
      parsedQuery.availableSeats = { $gte: parseInt(req.query.minSeats, 10) };
    }
    if (req.query.maxPrice) {
      parsedQuery.pricePerSeat = { $lte: parseInt(req.query.maxPrice, 10) };
    }

    query = Ride.find(parsedQuery).populate({
      path: 'creator',
      select: 'name profileImage rating'
    });

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('date');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Ride.countDocuments(parsedQuery);
    query = query.skip(startIndex).limit(limit);

    const rides = await query;
    const pagination = {};
    if (startIndex + limit < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: rides.length,
      pagination,
      data: rides
    });
  } catch (error) {
    next(error);
  }
};

exports.getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id).populate({
      path: 'creator',
      select: 'name profileImage rating phone totalReviews'
    });
    if (!ride) {
      return res.status(404).json({ success: false, error: 'Ride not found' });
    }
    res.status(200).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.updateRide = async (req, res, next) => {
  try {
    let ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, error: 'Ride not found' });
    }
    if (ride.creator.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this ride' });
    }
    if (ride.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Can only update active rides' });
    }
    ride = await Ride.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: ride });
  } catch (error) {
    next(error);
  }
};

exports.deleteRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ success: false, error: 'Ride not found' });
    }
    if (ride.creator.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this ride' });
    }
    
    const acceptedBookings = await Booking.countDocuments({ 
      ride: ride._id, 
      status: { $in: ['accepted', 'paid'] } 
    });
    
    if (acceptedBookings > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete ride with accepted or paid bookings' });
    }

    await Booking.updateMany(
      { ride: ride._id, status: 'pending' },
      { status: 'cancelled' }
    );

    await Ride.deleteOne({ _id: ride._id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

exports.getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ creator: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: rides.length, data: rides });
  } catch (error) {
    next(error);
  }
};
