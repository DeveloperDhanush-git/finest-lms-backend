const router = require('express').Router();

const {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require('../controllers/auth.controller');

const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/auth.validation');

const validateMiddleware = require('../middlewares/validate.middleware');

const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', validateMiddleware(registerSchema), register);
router.post('/login', validateMiddleware(loginSchema), login);
router.post('/refresh', validateMiddleware(refreshTokenSchema), refreshToken);
router.post('/logout', validateMiddleware(refreshTokenSchema), logout);
router.post('/forgot-password', validateMiddleware(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validateMiddleware(resetPasswordSchema), resetPassword);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
