const Enrollment = require('../models/enrollment.model');

const Course = require('../models/course.model');

const InstructorProfile = require('../models/instructor.model');

const enrollCourse = async (userId, courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: 'published',
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const instructor = await InstructorProfile.findOne({
    _id: course.instructorId,
  });

  if (instructor && instructor.userId.toString() === userId.toString()) {
    throw new Error('You cannot enroll in your own course');
  }

  const existingEnrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: { $in: ['active', 'completed'] },
  });

  if (existingEnrollment) {
    throw new Error('Already enrolled');
  }

  const enrollment = await Enrollment.create({
    studentId: userId,
    courseId,
  });

  await Course.findByIdAndUpdate(courseId, {
    $inc: {
      totalEnrollments: 1,
    },
  });

  return enrollment;
};

const getMyEnrollments = async (userId) => {
  return await Enrollment.find({
    studentId: userId,
    status: { $in: ['active', 'completed'] },
  })
    .populate({
      path: 'courseId',
      populate: [
        {
          path: 'categoryId',
          select: 'name slug',
        },
        {
          path: 'instructorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName avatar',
          },
        },
      ],
    })
    .sort({
      createdAt: -1,
    });
};

const checkEnrollment = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
  });

  return {
    isEnrolled: !!enrollment,
  };
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
};
