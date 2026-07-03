const router =
  require("express").Router();

const authMiddleware =
  require("../middlewares/auth.middleware");

const validate =
  require("../middlewares/validate.middleware");

const {
  enrollCourse,
  getMyEnrollments,
  getEnrolledCourse,
  checkEnrollment,
  updateProgress,
} = require(
  "../controllers/enrollment.controller"
);

const {
  updateProgressSchema,
} = require(
  "../validation/enrollment.validation"
);

router.post(
  "/:courseId",
  authMiddleware,
  enrollCourse
);

router.get(
  "/my-courses",
  authMiddleware,
  getMyEnrollments
);

router.get(
  "/course/:courseId",
  authMiddleware,
  getEnrolledCourse
);

router.get(
  "/check/:courseId",
  authMiddleware,
  checkEnrollment
);

router.patch(
  "/progress",
  authMiddleware,
  validate(
    updateProgressSchema
  ),
  updateProgress
);

module.exports =
  router;