const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const getUserResponseFields = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profileImage: user.profileImage,
  bio: user.bio,
  rating: user.rating,
  totalRides: user.totalRides,
  vehicle: user.vehicle,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: getUserResponseFields(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: getUserResponseFields(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: getUserResponseFields(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage, bio, vehicle } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (profileImage) fieldsToUpdate.profileImage = profileImage;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (vehicle) fieldsToUpdate.vehicle = vehicle;

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: getUserResponseFields(user)
    });
  } catch (error) {
    next(error);
  }
};
