const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const {
  generateCertificate,
  getMyCertificates,
  getCertificateByCourse,
  downloadCertificate,
  verifyCertificate,
} = require('../controllers/certificate.controller');

router.post('/course/:courseId', authMiddleware, roleMiddleware('student'), generateCertificate);

router.get('/', authMiddleware, roleMiddleware('student'), getMyCertificates);

router.get('/course/:courseId', authMiddleware, roleMiddleware('student'), getCertificateByCourse);

router.get(
  '/course/:courseId/download',
  authMiddleware,
  roleMiddleware('student'),
  downloadCertificate
);

router.get('/verify/:verificationCode', verifyCertificate);

module.exports = router;
