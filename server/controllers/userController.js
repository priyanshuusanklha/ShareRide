const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name profileImage rating totalReviews totalRides bio vehicle createdAt');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
