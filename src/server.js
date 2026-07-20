require('dotenv').config();

const http = require('http');

const app = require('./app');

const connectDB = require('./config/database');

const { initializeSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason, promise) => {
  console.error('━━━ UNHANDLED PROMISE REJECTION ━━━');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('━━━ UNCAUGHT EXCEPTION – APPLICATION WILL EXIT ━━━');
  console.error(err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Server is running in http://[IP_ADDRESS]:${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`Socket.IO initialized`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
