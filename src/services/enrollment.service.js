const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const InstructorProfile = require('../models/instructor.model');
const { NotFoundError, BadRequestError, ConflictError } = require('../errors');
const { STATUSES } = require('../constants');

const enrollCourse = async (userId, courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: STATUSES.COURSE.PUBLISHED,
    isDeleted: false,
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  const instructor = await InstructorProfile.findOne({
    _id: course.instructorId,
  });

  if (instructor && instructor.userId.toString() === userId.toString()) {
    throw new BadRequestError('You cannot enroll in your own course');
  }

  const existingEnrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: { $in: [STATUSES.ENROLLMENT.ACTIVE, STATUSES.ENROLLMENT.COMPLETED] },
  });

  if (existingEnrollment) {
    throw new ConflictError('Already enrolled');
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

  if (instructor) {
    await InstructorProfile.findByIdAndUpdate(instructor._id, {
      $inc: {
        totalStudents: 1,
      },
    });
  }

  return enrollment;
};

const getMyEnrollments = async (userId) => {
  return await Enrollment.find({
    studentId: userId,
    status: { $in: [STATUSES.ENROLLMENT.ACTIVE, STATUSES.ENROLLMENT.COMPLETED] },
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
