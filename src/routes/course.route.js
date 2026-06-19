const router =
  require("express").Router();

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

const validate =
  require("../middlewares/validate.middleware");

const {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
} = require(
  "../controllers/course.controller"
);

const {
  createCourseSchema,
  updateCourseSchema,
} = require(
  "../validation/course.validation"
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    createCourseSchema
  ),
  createCourse
);

router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  getMyCourses
);

router.get(
  "/:id",
  authMiddleware,
  getCourseById
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    updateCourseSchema
  ),
  updateCourse
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  deleteCourse
);

router.post(
  "/:id/publish",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  publishCourse
);

router.post(
  "/:id/unpublish",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  unpublishCourse
);

module.exports = router;