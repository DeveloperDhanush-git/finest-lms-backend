const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const { getDashboard } = require('../controllers/instructorDashboard.controller');

router.get('/', authMiddleware, roleMiddleware('instructor'), getDashboard);

module.exports = router;
