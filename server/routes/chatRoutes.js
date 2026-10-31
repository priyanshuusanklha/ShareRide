const express = require('express');
const router = express.Router();
const { createOrGetChat, getMyChats, getChatMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { validateMessage, handleValidationErrors } = require('../middleware/validate');

router.post('/', protect, createOrGetChat);
router.get('/', protect, getMyChats);
router.get('/:chatId', protect, getChatMessages);
router.post('/:chatId/messages', protect, validateMessage, handleValidationErrors, sendMessage);

module.exports = router;
