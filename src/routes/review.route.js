const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getMyReview,
} = require('../controllers/review.controller');

const { createReviewSchema, updateReviewSchema } = require('../validations/review.validation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('student'),
  validate(createReviewSchema),
  createReview
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('student'),
  validate(updateReviewSchema),
  updateReview
);

router.delete('/:id', authMiddleware, roleMiddleware('student'), deleteReview);

router.get('/my/:courseId', authMiddleware, roleMiddleware('student'), getMyReview);

router.get('/course/:courseId', getCourseReviews);

module.exports = router;
