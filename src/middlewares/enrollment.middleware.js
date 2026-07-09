const Enrollment = require('../models/enrollment.model');
const { ForbiddenError } = require('../errors');
const { asyncHandler } = require('../helpers');
const { STATUSES } = require('../constants');

const checkEnrollment = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;

  const enrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId,
    status: {
      $in: [STATUSES.ENROLLMENT.ACTIVE, STATUSES.ENROLLMENT.COMPLETED]
    },
  });

  if (!enrollment) {
    throw new ForbiddenError('You are not enrolled in this course');
  }

  req.enrollment = enrollment;
  next();
});

module.exports = checkEnrollment;
