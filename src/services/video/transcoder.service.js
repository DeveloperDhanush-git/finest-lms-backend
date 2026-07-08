const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const path = require('path');

const { getVideoMetadata } = require('./metadata.service');

const { getProfiles } = require('./profile.service');

const { createMasterPlaylist } = require('./masterPlaylist.service');

const generateProfile = (input, outputFolder, profile) => {
  return new Promise(async (resolve, reject) => {
    await fs.ensureDir(outputFolder);

    ffmpeg(input)
      .videoCodec('libx264')

      .audioCodec('aac')

      .size(`${profile.width}x${profile.height}`)

      .videoBitrate(profile.bitrate)

      .audioBitrate('128k')

      .outputOptions([
        '-preset veryfast',

        '-profile:v main',

        '-crf 20',

        '-sc_threshold 0',

        '-g 48',

        '-keyint_min 48',

        '-hls_time 6',

        '-hls_playlist_type vod',

        '-hls_flags independent_segments',

        '-hls_segment_filename ' + path.join(outputFolder, 'segment_%03d.ts'),
      ])

      .output(path.join(outputFolder, 'index.m3u8'))

      .on('start', (command) => {
        console.log(`${profile.name} started`);
      })

      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r${profile.name}: ${progress.percent.toFixed(1)}%`);
        }
      })

      .on('end', () => {
        console.log(`\n${profile.name} completed`);

        resolve();
      })

      .on('error', (error) => {
        console.error(`${profile.name} failed`);

        reject(error);
      })

      .run();
  });
};

const transcodeVideo = async (inputPath, outputRoot) => {

  const metadata = await getVideoMetadata(inputPath);

  const profiles = getProfiles(metadata);

  console.log('Profiles:');

  console.table(profiles);

  for (const profile of profiles) {
    const folder = path.join(outputRoot, profile.name);

    await generateProfile(inputPath, folder, profile);
  }

  await createMasterPlaylist(outputRoot, profiles);

  console.log('Master Playlist Created');

  return {
    metadata,

    generatedQualities: profiles.map((profile) => profile.name),
  };
};

module.exports = {
  transcodeVideo,
};
