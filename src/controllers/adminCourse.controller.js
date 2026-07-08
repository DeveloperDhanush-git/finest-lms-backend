const adminCourseService = require('../services/adminCourse.service');

const getPendingCourses = async (req, res, next) => {
  try {
    const courses = await adminCourseService.getPendingCourses();

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminCourseById = async (req, res, next) => {
  try {
    const result = await adminCourseService.getAdminCourseById(req.params.courseId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const approveCourse = async (req, res, next) => {
  try {
    const course = await adminCourseService.approveCourse(req.params.courseId, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Course approved successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const rejectCourse = async (req, res, next) => {
  try {
    const course = await adminCourseService.rejectCourse(
      req.params.courseId,
      req.user._id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: 'Course rejected successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingCourses,
  getAdminCourseById,
  approveCourse,
  rejectCourse,
};
