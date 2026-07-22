const Enrollment = require('../models/enrollment.model');
const CourseLecture = require('../models/lecture.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const InstructorProfile = require('../models/instructor.model');
const { generateSignedUrl } = require('./cloudfront.service');

const getLectureStream = async (lectureId, userId) => {
  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture || lecture.isDeleted) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const requestingUser = await User.findById(userId);
  if (!requestingUser) {
    throw new Error('User not found');
  }

  let hasAccess = false;
  if (requestingUser.role === 'admin') {
    hasAccess = true;
  } else if (requestingUser.role === 'instructor') {
    const instructorProfile = await InstructorProfile.findOne({ userId: requestingUser._id });
    if (instructorProfile && course.instructorId.toString() === instructorProfile._id.toString()) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    if (course.status !== 'published') {
      throw new Error('Course not found');
    }

    if (!lecture.isPreview) {
      const enrollment = await Enrollment.findOne({
        studentId: userId,
        courseId: course._id,
        status: { $in: ['active', 'completed'] },
      });

      if (!enrollment) {
        throw new Error('You are not enrolled in this course.');
      }
    }
  }

  if (lecture.video.processingStatus === 'failed') {
    throw new Error(lecture.video.processingError || 'Video processing failed.');
  }

  if (lecture.video.processingStatus !== 'completed') {
    throw new Error('Video is still processing.');
  }

  if (!lecture.video.masterPlaylist) {
    throw new Error('Master playlist not found.');
  }

  return {
    lectureId: lecture._id,

    title: lecture.title,

    duration: lecture.duration,

    isPreview: lecture.isPreview,

    thumbnail: lecture.video.thumbnail,

    metadata: lecture.video.metadata,

    resolutions: lecture.video.resolutions,

    streamUrl: generateSignedUrl(lecture.video.masterPlaylist),
  };
};

module.exports = {
  getLectureStream,
};
