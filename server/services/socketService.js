/**
 * Socket.io Service
 * 
 * To fully configure this service:
 * 1. Install socket.io: npm install socket.io
 * 2. Require it in server.js and pass the server instance
 */

exports.initializeSocket = (server) => {
  try {
    const socketIo = require('socket.io');
    const io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
      });

      socket.on('send_message', (data) => {
        // data should contain { chatId, message }
        io.to(data.chatId).emit('receive_message', data.message);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    console.log('Socket.io initialized successfully');
    return io;
  } catch (error) {
    console.warn('Socket.io is not installed or failed to initialize. Real-time features will not work.');
    return null;
  }
};
