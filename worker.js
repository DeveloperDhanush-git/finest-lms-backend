require('dotenv').config();

const connectDB = require('./src/config/database');

(async () => {
  await connectDB();

  console.log('MongoDB Connected');

  require('./src/workers/video.worker');
})();
