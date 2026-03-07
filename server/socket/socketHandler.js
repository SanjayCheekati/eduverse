const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const onlineUsers = new Map();

const socketHandler = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Track online user
    onlineUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: { _id: socket.user._id, name: socket.user.name, avatar: socket.user.avatar }
    });
    io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => u.user));

    // Join room
    socket.on('joinRoom', async (room) => {
      socket.join(room);

      // Send recent messages
      const messages = await Message.find({ room })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(50);

      socket.emit('roomMessages', messages.reverse());
    });

    // Leave room
    socket.on('leaveRoom', (room) => {
      socket.leave(room);
    });

    // Send message
    socket.on('sendMessage', async ({ room, content, type = 'text' }) => {
      try {
        const message = await Message.create({
          sender: socket.user._id,
          room,
          content,
          type,
          readBy: [socket.user._id]
        });

        const populated = await Message.findById(message._id)
          .populate('sender', 'name avatar');

        io.to(room).emit('newMessage', populated);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', ({ room }) => {
      socket.to(room).emit('userTyping', {
        user: { _id: socket.user._id, name: socket.user.name }
      });
    });

    socket.on('stopTyping', ({ room }) => {
      socket.to(room).emit('userStoppedTyping', {
        user: { _id: socket.user._id, name: socket.user.name }
      });
    });

    // Notification
    socket.on('sendNotification', ({ recipientId, notification }) => {
      const recipient = onlineUsers.get(recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit('notification', notification);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      onlineUsers.delete(socket.user._id.toString());
      io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => u.user));
    });
  });
};

module.exports = socketHandler;
