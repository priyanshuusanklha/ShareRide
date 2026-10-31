const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

exports.createOrGetChat = async (req, res, next) => {
  try {
    const { rideId, targetUserId } = req.body;
    
    // Check if participants are valid
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, error: 'Ride not found' });
    
    // Check if either is driver, and the other is an accepted/paid passenger, OR verify some logic
    // We assume targetUserId and req.user.id are the participants.
    
    let chat = await Chat.findOne({
      ride: rideId,
      participants: { $all: [req.user.id, targetUserId] }
    });

    if (!chat) {
      chat = await Chat.create({
        ride: rideId,
        participants: [req.user.id, targetUserId]
      });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    next(error);
  }
};

exports.getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name profileImage')
      .populate('ride', 'from to date')
      .sort('-updatedAt');
      
    res.status(200).json({ success: true, count: chats.length, data: chats });
  } catch (error) {
    next(error);
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    
    if (!chat.participants.includes(req.user.id)) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name profileImage')
      .sort('createdAt');
      
    // Mark as read could be implemented here

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    if (!chat.participants.includes(req.user.id)) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    const message = await Message.create({
      chat: chat._id,
      sender: req.user.id,
      content,
      readBy: [req.user.id]
    });

    chat.lastMessage = {
      content,
      sender: req.user.id,
      timestamp: Date.now()
    };
    await chat.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name profileImage');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};
