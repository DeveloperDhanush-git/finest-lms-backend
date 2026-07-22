const CourseLecture = require('../models/lecture.model');

const Course = require('../models/course.model');

const CourseSection = require('../models/section.model');

const InstructorProfile = require('../models/instructor.model');
const User = require('../models/user.model');

const { deleteFileFromS3, deleteDirectoryFromS3 } = require('./s3.service');

const fs = require('fs-extra');

const createLecture = async (userId, data) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: data.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found or access denied');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const section = await CourseSection.findOne({
    _id: data.sectionId,
    courseId: data.courseId,
  });

  if (!section) {
    throw new Error('Section not found in course');
  }

  const lecture = await CourseLecture.create(data);

  await Course.findByIdAndUpdate(data.courseId, {
    $inc: {
      totalLectures: 1,
      totalDuration: data.duration,
    },
  });

  await CourseSection.findByIdAndUpdate(data.sectionId, {
    $inc: {
      totalLectures: 1,
      totalDuration: data.duration,
    },
  });

  return lecture;
};

const getLecturesBySection = async (sectionId, userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const section = await CourseSection.findById(sectionId);
  if (!section) {
    throw new Error('Section not found');
  }

  let course;
  if (user.role === 'admin') {
    course = await Course.findOne({
      _id: section.courseId,
      isDeleted: false,
    });
  } else {
    const instructor = await InstructorProfile.findOne({ userId });
    course = await Course.findOne({
      _id: section.courseId,
      instructorId: instructor?._id,
      isDeleted: false,
    });
  }

  if (!course) {
    throw new Error('Course not found or access denied');
  }

  return await CourseLecture.find({
    sectionId,
    isDeleted: false,
  }).sort({
    order: 1,
  });
};

const updateLecture = async (lectureId, userId, updateData) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const oldLecture = await CourseLecture.findById(lectureId);

  if (!oldLecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: oldLecture.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized to update this lecture');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const durationDiff = (updateData.duration || oldLecture.duration) - oldLecture.duration;

  const lecture = await CourseLecture.findByIdAndUpdate(lectureId, updateData, {
    returnDocument: 'after',
    runValidators: true,
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

  return lecture;
};

const deleteLecture = async (lectureId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized to delete this lecture');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  if (lecture.video?.s3Prefix) {
    await deleteDirectoryFromS3(lecture.video.s3Prefix);
  }

  const deletedLecture = await CourseLecture.findOneAndUpdate(
    {
      _id: lectureId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      returnDocument: 'after',
    }
  );

  if (!deletedLecture) {
    throw new Error('Lecture not found');
  }

  await Course.findByIdAndUpdate(lecture.courseId, {
    $inc: {
      totalLectures: -1,
      totalDuration: -lecture.duration,
    },
  });

  await CourseSection.findByIdAndUpdate(lecture.sectionId, {
    $inc: {
      totalLectures: -1,
      totalDuration: -lecture.duration,
    },
  });

  return deletedLecture;
};

const updateLectureResource = async (lectureId, userId, resource) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  lecture.resources.push(resource);

  await lecture.save();

  return lecture;
};

const deleteLectureResource = async (lectureId, userId, resourceId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const resource = lecture.resources.id(resourceId);

  if (!resource) {
    throw new Error('Resource not found');
  }

  await deleteFileFromS3(resource.key);

  resource.deleteOne();

  await lecture.save();

  return lecture;
};

const markLectureProcessing = async (lectureId, userId, videoPath) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,

    instructorId: instructor._id,

    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  if (lecture.video.processingStatus === 'processing') {
    throw new Error('Video is already processing.');
  }

  if (lecture.video.s3Prefix) {
    await deleteDirectoryFromS3(lecture.video.s3Prefix);
  }

  if (lecture.video.original) {
    await fs.remove(lecture.video.original).catch(() => { });
  }

  lecture.video = {
    original: videoPath,

    masterPlaylist: null,

    s3Prefix: null,

    thumbnail: null,

    processingStatus: 'processing',

    processingError: null,

    resolutions: [],

    metadata: null,
  };

  await lecture.save();

  return lecture;
};

const removeLectureVideo = async (lectureId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  if (lecture.video?.s3Prefix) {
    await deleteDirectoryFromS3(lecture.video.s3Prefix);
  }

  if (lecture.video.original) {
    await fs.remove(lecture.video.original).catch(() => { });
  }

  lecture.video = {
    original: null,

    masterPlaylist: null,

    s3Prefix: null,

    thumbnail: null,

    processingStatus: 'pending',

    processingError: null,

    resolutions: [],

    metadata: null,
  };

  await lecture.save();

  return lecture;
};
const getLectureVideoStatus = async (lectureId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const lecture = await CourseLecture.findById(lectureId);

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const course = await Course.findOne({
    _id: lecture.courseId,

    instructorId: instructor._id,

    isDeleted: false,
  });

  if (!course) {
    throw new Error('Unauthorized');
  }

  return {
    lectureId: lecture._id,

    status: lecture.video.processingStatus,

    error: lecture.video.processingError,

    streamUrl: lecture.video.masterPlaylist,
  };
};

const reorderLectures = async (sectionId, userId, orderedIds) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const section = await CourseSection.findById(sectionId);
  if (!section) {
    throw new Error('Section not found');
  }

  const course = await Course.findOne({
    _id: section.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found or access denied');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, sectionId, isDeleted: false },
      update: { $set: { order: index + 1 } },
    },
  }));

  await CourseLecture.bulkWrite(ops);

  return await CourseLecture.find({ sectionId, isDeleted: false }).sort({ order: 1 });
};

module.exports = {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,

  updateLectureResource,
  deleteLectureResource,

  markLectureProcessing,
  removeLectureVideo,
  getLectureVideoStatus,
  reorderLectures,
};
