const studentService = require('../services/student.service');

const getMyLearning = async (req, res, next) => {
  try {
    const data = await studentService.getMyLearning(req.user._id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const data = await studentService.getCourse(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseCurriculum = async (req, res, next) => {
  try {
    const data = await studentService.getCourseCurriculum(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getLecture = async (req, res, next) => {
  try {
    const data = await studentService.getLecture(
      req.user._id,
      req.params.courseId,
      req.params.lectureId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const data = await studentService.updateProgress(
      req.user._id,
      req.params.courseId,
      req.params.lectureId
    );

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseProgress = async (req, res, next) => {
  try {
    const data = await studentService.getCourseProgress(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getResumeLecture = async (req, res, next) => {
  try {
    const data = await studentService.getResumeLecture(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const completeCourse = async (req, res, next) => {
  try {
    const data = await studentService.completeCourse(req.user._id, req.params.courseId);

    return res.status(200).json({
      success: true,
      message: 'Course completed successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyLearning,
  getCourse,
  getCourseCurriculum,
  getLecture,
  updateProgress,
  getCourseProgress,
  getResumeLecture,
  completeCourse,
};
