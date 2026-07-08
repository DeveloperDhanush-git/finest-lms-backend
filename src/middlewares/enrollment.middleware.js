const Enrollment = require('../models/enrollment.model');

const checkEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;

    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId,
      status: { $in: ['active', 'completed'] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    req.enrollment = enrollment;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkEnrollment;
