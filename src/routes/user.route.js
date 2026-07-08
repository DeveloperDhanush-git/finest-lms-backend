const {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
} = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const { updateProfileSchema, changePasswordSchema } = require('../validations/user.validation');
const router = require('express').Router();
const validateMiddleware = require('../middlewares/validate.middleware');

router.get('/profile', authMiddleware, getUserProfile);

router.patch(
  '/profile',
  authMiddleware,
  validateMiddleware(updateProfileSchema),
  updateUserProfile
);

router.delete('/profile', authMiddleware, deleteUserProfile);

router.post('/avatar', authMiddleware, uploadImage.single('avatar'), uploadAvatar);

router.delete('/avatar', authMiddleware, removeAvatar);

router.patch(
  '/change-password',
  authMiddleware,
  validateMiddleware(changePasswordSchema),
  changePassword
);

module.exports = router;
