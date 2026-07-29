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
  reorderSections,
} = require(
  "../controllers/section.controller"
);

const {
  createSectionSchema,
  updateSectionSchema,
} = require(
  "../validations/section.validation"
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
  roleMiddleware(
    "instructor",
    "admin"
  ),
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

router.put(
  "/course/:courseId/reorder",
  authMiddleware,
  roleMiddleware(
    "instructor",
    "admin"
  ),
  reorderSections
);

module.exports = router;