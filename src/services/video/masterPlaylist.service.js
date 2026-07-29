const fs = require('fs-extra');
const path = require('path');

const BANDWIDTH = {
  '144p': 150000,
  '240p': 400000,
  '360p': 800000,
  '480p': 1400000,
  '720p': 2800000,
  '1080p': 5000000,
};

const RESOLUTION = {
  '144p': '256x144',
  '240p': '426x240',
  '360p': '640x360',
  '480p': '854x480',
  '720p': '1280x720',
  '1080p': '1920x1080',
};

const createMasterPlaylist = async (outputFolder, profiles) => {
  let content = '#EXTM3U\n';

  for (const profile of profiles) {
    content += `#EXT-X-STREAM-INF:BANDWIDTH=${BANDWIDTH[profile.name]},RESOLUTION=${RESOLUTION[profile.name]}\n`;

    content += `${profile.name}/index.m3u8\n`;
  }

  await fs.writeFile(path.join(outputFolder, 'master.m3u8'), content);

  console.log('Master Playlist Created');
};

module.exports = {
  createMasterPlaylist,
};
