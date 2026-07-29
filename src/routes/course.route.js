const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  submitCourse,
  unpublishCourse,
  uploadThumbnail,
  removeThumbnail,
  uploadPreviewVideo,
  removePreviewVideo,
  getSearchSuggestions,
} = require('../controllers/course.controller');

const { uploadImage, uploadVideo } = require('../middlewares/upload.middleware');

const { createCourseSchema, updateCourseSchema } = require('../validations/course.validation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validate(createCourseSchema),
  createCourse
);

router.get('/my-courses', authMiddleware, roleMiddleware('instructor', 'admin'), getMyCourses);

router.get('/search/suggestions', getSearchSuggestions);

router.get('/:id', authMiddleware, getCourseById);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validate(updateCourseSchema),
  updateCourse
);

router.delete('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), deleteCourse);

router.patch('/:id/submit', authMiddleware, roleMiddleware('instructor', 'admin'), submitCourse);

router.post('/:id/publish', authMiddleware, roleMiddleware('instructor', 'admin'), submitCourse);

router.post(
  '/:id/unpublish',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  unpublishCourse
);

router.post(
  '/:id/thumbnail',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  uploadImage.single('thumbnail'),
  uploadThumbnail
);

router.delete(
  '/:id/thumbnail',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  removeThumbnail
);

router.post(
  '/:id/preview-video',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  uploadVideo.single('previewVideo'),
  uploadPreviewVideo
);

router.delete(
  '/:id/preview-video',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  removePreviewVideo
);

module.exports = router;
