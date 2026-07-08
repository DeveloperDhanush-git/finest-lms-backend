const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const { getLectureStream } = require('../controllers/stream.controller');

router.get('/lecture/:lectureId', authMiddleware, getLectureStream);

module.exports = router;
