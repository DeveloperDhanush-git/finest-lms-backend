const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const { getStudentDashboard } = require('../controllers/dashboard.controller');

router.get('/student', authMiddleware, roleMiddleware('student'), getStudentDashboard);

module.exports = router;
