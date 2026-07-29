const { addUser, removeUser } = require('./users');

const registerEvents = (io, socket) => {
  addUser(socket.user._id, socket.id);

  console.log('Online:', socket.user._id, socket.id);

  socket.on('disconnect', () => {
    removeUser(socket.id);

    console.log('Offline:', socket.user._id);
  });
};

module.exports = registerEvents;
