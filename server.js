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
    console.log('New client connected in server.js File Line 27');



  socket.on('join-ride', (rideId) => {
    socket.join(rideId);
    connectedUsers.set(socket.id, rideId);
    console.log(`Client joined ride: ${rideId}`);
  });

    socket.on('update-location', ({ rideId, location }) => {
      console.log(`Location update for ride ${rideId}:`, location);
      io.to(rideId).emit('location-updated', { rideId, location });
    });

    socket.on('send-message', ({ rideId, message }) => {
      console.log(`New message for ride ${rideId}:`, message);
      io.to(rideId).emit('new-message', message);
    });

    // New event for booking actions
    socket.on('booking_action', ({ bookingId, action, passengerId }) => {
      console.log(`Booking action: ${action} for booking ${bookingId}`);
      
      // Emit to the specific passenger
      const passengerSocketId = connectedUsers.get(passengerId);
      if (passengerSocketId) {
        io.to(passengerSocketId).emit("ride_status", { status: action.toLowerCase() });
      }

      // Emit to all connected clients
      io.emit('booking_status_update', { bookingId, status: action });
    });

    socket.on('disconnect', () => {
      // Remove user from connectedUsers on disconnect
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log('Client disconnected');
    });
  });

  // Handle Socket.IO handshake
  expressApp.get('/api/socket', (req, res) => {
    res.send('Socket.IO server is running');
  });

  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});