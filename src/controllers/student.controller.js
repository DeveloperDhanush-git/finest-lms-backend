const studentService = require('../services/student.service');
const { asyncHandler, success } = require('../helpers');

const getMyLearning = asyncHandler(async (req, res) => {
  const data = await studentService.getMyLearning(req.user._id);
  return success(res, 'My learning retrieved successfully', data);
});

const getCourse = asyncHandler(async (req, res) => {
  const data = await studentService.getCourse(req.user._id, req.params.courseId);
  return success(res, 'Course retrieved successfully', data);
});

const getCourseCurriculum = asyncHandler(async (req, res) => {
  const data = await studentService.getCourseCurriculum(req.user._id, req.params.courseId);
  return success(res, 'Course curriculum retrieved successfully', data);
});

const getLecture = asyncHandler(async (req, res) => {
  const data = await studentService.getLecture(
    req.user._id,
    req.params.courseId,
    req.params.lectureId
  );
  return success(res, 'Lecture retrieved successfully', data);
});

const updateProgress = asyncHandler(async (req, res) => {
  const data = await studentService.updateProgress(
    req.user._id,
    req.params.courseId,
    req.params.lectureId
  );
  return success(res, 'Progress updated successfully', data);
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const data = await studentService.getCourseProgress(req.user._id, req.params.courseId);
  return success(res, 'Course progress retrieved successfully', data);
});

const getResumeLecture = asyncHandler(async (req, res) => {
  const data = await studentService.getResumeLecture(req.user._id, req.params.courseId);
  return success(res, 'Resume lecture info retrieved successfully', data);
});

const completeCourse = asyncHandler(async (req, res) => {
  const data = await studentService.completeCourse(req.user._id, req.params.courseId);
  return success(res, 'Course completed successfully', data);
});

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
