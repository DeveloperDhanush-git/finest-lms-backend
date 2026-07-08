const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const { getDashboard } = require('../controllers/adminDashboard.controller');

router.get('/', authMiddleware, roleMiddleware('admin'), getDashboard);

module.exports = router;
