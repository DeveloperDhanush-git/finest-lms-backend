const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  getInstructorProfile,
  updateInstructorProfile,
  becomeInstructor,
} = require('../controllers/instructor.controller');

const {
  createInstructorSchema,
  updateInstructorSchema,
} = require('../validations/instructor.validation');

router.post(
  '/become-instructor',
  authMiddleware,
  validate(createInstructorSchema),
  becomeInstructor
);

router.get('/profile', authMiddleware, roleMiddleware('instructor', 'admin'), getInstructorProfile);

router.patch(
  '/profile',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validate(updateInstructorSchema),
  updateInstructorProfile
);

module.exports = router;
