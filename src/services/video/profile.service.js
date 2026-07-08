const VIDEO_PROFILES = [
  {
    name: '144p',
    width: 256,
    height: 144,
    bitrate: '120k',
  },

  {
    name: '240p',
    width: 426,
    height: 240,
    bitrate: '300k',
  },

  {
    name: '360p',
    width: 640,
    height: 360,
    bitrate: '700k',
  },

  {
    name: '480p',
    width: 854,
    height: 480,
    bitrate: '1200k',
  },

  {
    name: '720p',
    width: 1280,
    height: 720,
    bitrate: '2800k',
  },

  {
    name: '1080p',
    width: 1920,
    height: 1080,
    bitrate: '5000k',
  },
];

const getProfiles = (metadata) => {
  return VIDEO_PROFILES.filter((profile) => profile.height <= metadata.height);
};

module.exports = {
  getProfiles,
};
