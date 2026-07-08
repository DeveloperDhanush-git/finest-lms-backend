const enrollmentService = require('../services/enrollment.service');

const enrollCourse = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollCourse(req.user._id, req.params.courseId);

    return res.status(201).json({
      success: true,
      message: 'Course enrolled successfully',
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user._id);

    return res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

const checkEnrollment = async (req, res, next) => {
  try {
    const result = await enrollmentService.checkEnrollment(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
};
