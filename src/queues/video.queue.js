const { Queue } = require('bullmq');

const redis = require('../config/redis');

const videoQueue = new Queue('video-processing', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 20,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

module.exports = videoQueue;
