const path = require('path');
const fs = require('fs-extra');

const CourseLecture = require('../../models/lecture.model');
const Course = require('../../models/course.model');
const CourseSection = require('../../models/section.model');

const { transcodeVideo } = require('./transcoder.service');

const { uploadHLSDirectoryToS3 } = require('../uploadHLS.service');

const processVideoPipeline = async ({ lectureId, videoPath }) => {
  const outputFolder = path.join(process.cwd(), 'storage', 'processed', lectureId.toString());

  await fs.ensureDir(outputFolder);

  let success = false;

  try {
    console.log('=================================');
    console.log('Starting Video Pipeline');
    console.log({
      lectureId,
      videoPath,
    });
    console.log('==================================');

    const { metadata, generatedQualities } = await transcodeVideo(videoPath, outputFolder);

    console.log('HLS Generated');

    const files = await fs.readdir(outputFolder);

    console.log('Output folder contents:');
    console.log(files);

    const { uploaded, basePrefix } = await uploadHLSDirectoryToS3(lectureId, outputFolder);

    console.log('S3 Upload Completed');

    const master = uploaded.find((file) => file.relative === 'master.m3u8');

    if (!master) {
      throw new Error('Master playlist missing.');
    }

    const resolutions = uploaded
      .filter((file) => file.relative.endsWith('index.m3u8'))
      .map((file) => ({
        quality: file.relative.split('/')[0],

        playlist: file.url,
      }));

    const lecture = await CourseLecture.findById(lectureId);

    const durationDiff = metadata.duration - lecture.duration;

    await CourseLecture.findByIdAndUpdate(lectureId, {
      $set: {
        'video.original': null,
        'video.masterPlaylist': master.url,
        'video.s3Prefix': basePrefix,
        'video.processingStatus': 'completed',
        'video.processingError': null,
        'video.resolutions': resolutions,
        'video.metadata': metadata,
        duration: metadata.duration,
      },
    });

    if (durationDiff !== 0) {
      await Course.findByIdAndUpdate(lecture.courseId, {
        $inc: {
          totalDuration: durationDiff,
        },
      });

      await CourseSection.findByIdAndUpdate(lecture.sectionId, {
        $inc: {
          totalDuration: durationDiff,
        },
      });
    }

    success = true;

    console.log('Lecture Updated Successfully');

    console.table(generatedQualities);

    console.log('Duration:', metadata.duration);
  } catch (error) {
    console.error(error);

    await CourseLecture.findByIdAndUpdate(lectureId, {
      $set: {
        'video.processingStatus': 'failed',

        'video.processingError': error.message,
      },
    });
  } finally {
    console.log('Cleaning Temporary Files...');

    await fs.remove(outputFolder).catch(() => {});

    await fs.remove(videoPath).catch(() => {});

    console.log('Cleanup Completed');
  }
};

module.exports = {
  processVideoPipeline,
};
