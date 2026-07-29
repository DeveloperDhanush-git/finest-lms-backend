const router = require('express').Router();

const { getCourses, getCourseById } = require('../controllers/publicCourse.controller');

router.get('/', getCourses);

router.get('/:id', getCourseById);

module.exports = router;
