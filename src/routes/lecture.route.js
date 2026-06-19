const router =
  require("express").Router();

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

const validate =
  require("../middlewares/validate.middleware");

const {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,
} = require(
  "../controllers/lecture.controller"
);

const {
  createLectureSchema,
  updateLectureSchema,
} = require(
  "../validation/lecture.validation"
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    createLectureSchema
  ),
  createLecture
);

router.get(
  "/section/:sectionId",
  authMiddleware,
  getLecturesBySection
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    updateLectureSchema
  ),
  updateLecture
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  deleteLecture
);

module.exports = router;