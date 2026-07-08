const { Worker } = require('bullmq');

const redis = require('../config/redis');

const { processVideoPipeline } = require('../services/video/videoPipeline.service');

const worker = new Worker(
  'video-processing',

  async (job) => {
    console.log('Processing:', job.data.lectureId);

    await processVideoPipeline(job.data);
  },

  {
    connection: redis,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});

console.log('Video Worker Started');
