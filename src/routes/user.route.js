const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { updateProfileSchema } = require('../validation/user.validation')
const router = require('express').Router();
const validateMiddleware = require('../middlewares/validate.middleware');

router.get("/profile", authMiddleware, getUserProfile)
router.patch("/profile",authMiddleware,validateMiddleware(updateProfileSchema), updateUserProfile)
router.delete("/profile",authMiddleware, deleteUserProfile)

module.exports = router;