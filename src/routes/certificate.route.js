const router =
  require("express").Router();

const authMiddleware =
  require("../middlewares/auth.middleware");

const roleMiddleware =
  require("../middlewares/role.middleware");

const {
  generateCertificate,
  getMyCertificates,
  getCertificateByCourse,
  downloadCertificate,
  verifyCertificate,
} = require(
  "../controllers/certificate.controller"
);

/*
-----------------------------------------
Generate Certificate
-----------------------------------------
*/

router.post(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  generateCertificate
);

/*
-----------------------------------------
My Certificates
-----------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("student"),
  getMyCertificates
);

/*
-----------------------------------------
Course Certificate
-----------------------------------------
*/

router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("student"),
  getCertificateByCourse
);

/*
-----------------------------------------
Download Certificate
-----------------------------------------
*/

router.get(
  "/course/:courseId/download",
  authMiddleware,
  roleMiddleware("student"),
  downloadCertificate
);

/*
-----------------------------------------
Public Verification
-----------------------------------------
*/

router.get(
  "/verify/:verificationCode",
  verifyCertificate
);

module.exports = router;