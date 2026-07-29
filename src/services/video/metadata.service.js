const ffmpeg = require('fluent-ffmpeg');

const getVideoMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(
      videoPath,

      (err, metadata) => {
        if (err) return reject(err);

        const video = metadata.streams.find((stream) => stream.codec_type === 'video');

        resolve({
          duration: metadata.format.duration,

          bitrate: metadata.format.bit_rate,

          width: video.width,

          height: video.height,

          codec: video.codec_name,

          fps: eval(video.r_frame_rate),
        });
      }
    );
  });
};

module.exports = {
  getVideoMetadata,
};
