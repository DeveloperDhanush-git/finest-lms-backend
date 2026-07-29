const enrollmentService = require('../services/enrollment.service');
const { asyncHandler, success, created } = require('../helpers');

const enrollCourse = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollCourse(req.user._id, req.params.courseId);
  return created(res, 'Course enrolled successfully', enrollment);
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getMyEnrollments(req.user._id);
  return success(res, 'Enrollments retrieved successfully', enrollments);
});

const checkEnrollment = asyncHandler(async (req, res) => {
  const result = await enrollmentService.checkEnrollment(req.user._id, req.params.courseId);
  return success(res, 'Enrollment check completed successfully', result);
});

module.exports = {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
};
