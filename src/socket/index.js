const { Server } = require('socket.io');

const authSocket = require('./auth');

const registerEvents = require('./events');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',

      methods: ['GET', 'POST'],
    },
  });

  io.use(authSocket);

  io.on('connection', (socket) => {
    registerEvents(io, socket);
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized.');
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
