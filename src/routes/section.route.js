const router =
  require("express").Router();

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

const validate =
  require("../middlewares/validate.middleware");

const {
  createSection,
  getSections,
  updateSection,
  deleteSection,
} = require(
  "../controllers/section.controller"
);

const {
  createSectionSchema,
  updateSectionSchema,
} = require(
  "../validation/section.validation"
);

router.post(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    createSectionSchema
  ),
  createSection
);

router.get(
  "/course/:courseId",
  authMiddleware,
  getSections
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  validate(
    updateSectionSchema
  ),
  updateSection
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  deleteSection
);

module.exports = router;