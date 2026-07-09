const publicCourseService = require('../services/publicCourse.service');
const { asyncHandler, success } = require('../helpers');

const getCourses = asyncHandler(async (req, res) => {
  const data = await publicCourseService.getPublicCourses(req.query);
  return res.status(200).json({
    success: true,
    ...data,
  });
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await publicCourseService.getPublicCourseById(req.params.id);
  return success(res, 'Public course retrieved successfully', course);
});

module.exports = {
  getCourses,
  getCourseById,
};
