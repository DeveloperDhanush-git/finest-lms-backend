const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  getPendingCourses,
  getAdminCourseById,
  approveCourse,
  rejectCourse,
} = require('../controllers/adminCourse.controller');

const { rejectCourseSchema } = require('../validations/adminCourse.validation');

router.get('/pending', authMiddleware, roleMiddleware('admin'), getPendingCourses);

router.get('/:courseId', authMiddleware, roleMiddleware('admin'), getAdminCourseById);

router.patch('/:courseId/approve', authMiddleware, roleMiddleware('admin'), approveCourse);

router.patch(
  '/:courseId/reject',
  authMiddleware,
  roleMiddleware('admin'),
  validate(rejectCourseSchema),
  rejectCourse
);

module.exports = router;
