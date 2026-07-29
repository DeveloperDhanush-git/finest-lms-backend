const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const {
  getMyLearning,
  getCourse,
  getCourseCurriculum,
  getLecture,
  updateProgress,
  getCourseProgress,
  getResumeLecture,
  completeCourse,
} = require('../controllers/student.controller');

router.get('/my-learning', authMiddleware, getMyLearning);

router.get('/course/:courseId', authMiddleware, getCourse);

router.get('/course/:courseId/curriculum', authMiddleware, getCourseCurriculum);

router.get('/course/:courseId/lecture/:lectureId', authMiddleware, getLecture);

router.patch('/course/:courseId/lecture/:lectureId/progress', authMiddleware, updateProgress);

router.get('/course/:courseId/progress', authMiddleware, getCourseProgress);

router.get('/course/:courseId/resume', authMiddleware, getResumeLecture);

router.post('/course/:courseId/complete', authMiddleware, completeCourse);

module.exports = router;
