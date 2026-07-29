const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
} = require('../controllers/enrollment.controller');

router.post('/:courseId', authMiddleware, enrollCourse);

router.get('/my-courses', authMiddleware, getMyEnrollments);

router.get('/check/:courseId', authMiddleware, checkEnrollment);

module.exports = router;
