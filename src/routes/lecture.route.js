const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');

const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,
  uploadLectureVideo,
  removeLectureVideo,
  uploadLectureResource,
  removeLectureResource,
  getLectureVideoStatus,
  reorderLectures,
} = require('../controllers/lecture.controller');

const { uploadVideo, uploadResource } = require('../middlewares/upload.middleware');

const { createLectureSchema, updateLectureSchema } = require('../validations/lecture.validation');

router.post(
  '/',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validate(createLectureSchema),
  createLecture
);

router.get(
  '/section/:sectionId',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  getLecturesBySection
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validate(updateLectureSchema),
  updateLecture
);

router.delete('/:id', authMiddleware, roleMiddleware('instructor', 'admin'), deleteLecture);

router.post(
  '/:id/video',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  uploadVideo.single('video'),
  uploadLectureVideo
);

router.get(
  '/:id/video/status',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  getLectureVideoStatus
);

router.delete(
  '/:id/video',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  removeLectureVideo
);

router.post(
  '/:id/resource',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  uploadResource.single('file'),
  uploadLectureResource
);

router.delete(
  '/:id/resource/:resourceId',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  removeLectureResource
);

router.put(
  '/section/:sectionId/reorder',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  reorderLectures
);

module.exports = router;
