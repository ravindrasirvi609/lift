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

    socket.on('join-ride', (rideId) => {
      socket.join(rideId);
      connectedUsers.set(socket.id, rideId);
      console.log(`Client ${socket.id} joined ride: ${rideId}`);
      io.to(rideId).emit('user-joined', { userId: socket.id, rideId });
    });

    socket.on('update-location', ({ rideId, location }) => {
      console.log(`Location update for ride ${rideId}:`, location);
      io.to(rideId).emit('location-updated', { rideId, location });
    });

    socket.on('send-message', ({ rideId, message }) => {
      console.log(`New message for ride ${rideId}:`, message);
      io.to(rideId).emit('new-message', { rideId, message });
    });

    socket.on('booking-action', ({ bookingId, action, passengerId }) => {
      console.log(`Booking action: ${action} for booking ${bookingId}`);
      
      // Emit to the specific passenger
      io.to(passengerId).emit('ride-status', { bookingId, status: action.toLowerCase() });
console.log("booking-action",connectedUsers);

      // Emit to all connected clients in the ride
      const rideId = connectedUsers.get(socket.id);
      console.log("rideId",rideId);
      if (rideId) {
        io.to(rideId).emit('booking-status-update', { bookingId, status: action });
      }
    });

    socket.on('disconnect', () => {
      const rideId = connectedUsers.get(socket.id);
      if (rideId) {
        connectedUsers.delete(socket.id);
        console.log(`Client ${socket.id} disconnected from ride ${rideId}`);
        io.to(rideId).emit('user-left', { userId: socket.id, rideId });
      }
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