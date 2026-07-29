const adminCourseService = require('../services/adminCourse.service');
const { asyncHandler, success } = require('../helpers');

const getPendingCourses = asyncHandler(async (req, res) => {
  const courses = await adminCourseService.getPendingCourses();
  return success(res, 'Pending courses retrieved successfully', courses);
});

const getAdminCourseById = asyncHandler(async (req, res) => {
  const result = await adminCourseService.getAdminCourseById(req.params.courseId);
  return success(res, 'Admin course details retrieved successfully', result);
});

const approveCourse = asyncHandler(async (req, res) => {
  const course = await adminCourseService.approveCourse(req.params.courseId, req.user._id);
  return success(res, 'Course approved successfully', course);
});

const rejectCourse = asyncHandler(async (req, res) => {
  const course = await adminCourseService.rejectCourse(
    req.params.courseId,
    req.user._id,
    req.body.reason
  );
  return success(res, 'Course rejected successfully', course);
});

module.exports = {
  getPendingCourses,
  getAdminCourseById,
  approveCourse,
  rejectCourse,
};
