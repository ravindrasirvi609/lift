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

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-ride', (rideId) => {
      socket.join(rideId);
      console.log(`Client joined ride: ${rideId}`);
    });

    socket.on('update-location', ({ rideId, location }) => {
      console.log(`Location update for ride ${rideId}:`, location);
      io.to(rideId).emit('location-updated', { rideId, location });
    });

    socket.on('send-message', ({ rideId, message }) => {
      console.log(`New message in ride ${rideId}:`, message);
      io.to(rideId).emit('new-message', { rideId, message });
    });

    socket.on('disconnect', () => {
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