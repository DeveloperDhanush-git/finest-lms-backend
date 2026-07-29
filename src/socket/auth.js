const jwt = require('jsonwebtoken');

const authSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch {
    next(new Error('Unauthorized'));
  }
};

module.exports = authSocket;
