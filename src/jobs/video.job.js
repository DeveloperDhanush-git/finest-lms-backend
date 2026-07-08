const videoQueue = require('../queues/video.queue');

const addVideoJob = async ({ lectureId, videoPath }) => {
  return await videoQueue.add(
    'process-video',

    {
      lectureId,
      videoPath,
    },

    {
      removeOnComplete: 100,

      removeOnFail: 500,

      attempts: 3,

      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    }
  );
};

module.exports = {
  addVideoJob,
};
