const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);
  
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('join-ride', (bookingId) => {
      console.log(`Client ${socket.id} attempting to join booking: ${bookingId}`);
      if (!socket.rooms.has(bookingId)) {
        socket.join(bookingId);
        connectedUsers.set(socket.id, bookingId);
        console.log(`Client ${socket.id} joined booking: ${bookingId}`);
        io.to(bookingId).emit('user-joined', { userId: socket.id, bookingId });
      } else {
        console.log(`Client ${socket.id} already in booking: ${bookingId}`);
      }
    });

    socket.on('join-user', (userId) => {
  socket.join(userId);
  console.log(`User ${userId} joined their own room`);
});

socket.on('send-notification', ({ userId, notification }) => {
  console.log(`Sending notification to user ${userId}:`, notification);
  io.to(userId).emit('new-notification', notification);
  console.log(`Notification emitted to user ${userId}`);
});

    socket.on('update-location', ({ bookingId, location }) => {
      console.log(`Location update for booking ${bookingId}:`, location);
      io.to(bookingId).emit('location-updated', { bookingId, location });
    });

    socket.on('send-message', ({ bookingId, message }) => {
      console.log(`New message for booking ${bookingId}:`, message);
      io.to(bookingId).emit('new-message', { bookingId, message });
    });

    socket.on('booking-action', ({ bookingId, action, passengerId }) => {
      console.log(`Booking action: ${action} for booking ${bookingId}`);
      
      io.to(bookingId).emit('booking-action', { bookingId, action });
      console.log(`Emitted booking-action to booking ${bookingId}`);
    
      // You can also emit to the specific passenger if needed
      io.to(passengerId).emit('booking-action', { bookingId, action });
    });

    socket.on('leave-ride', (bookingId) => {
      console.log(`Client ${socket.id} leaving booking: ${bookingId}`);
      socket.leave(bookingId);
      connectedUsers.delete(socket.id);
    });

    socket.on('disconnect', () => {
      const bookingId = connectedUsers.get(socket.id);
      if (bookingId) {
        connectedUsers.delete(socket.id);
        console.log(`Client ${socket.id} disconnected from booking ${bookingId}`);
        socket.leave(bookingId);
        io.to(bookingId).emit('user-left', { userId: socket.id, bookingId });
      }
    });
  });

  expressApp.get('/api/socket', (req, res) => {
    res.send('Socket.IO server is running');
  });

  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});