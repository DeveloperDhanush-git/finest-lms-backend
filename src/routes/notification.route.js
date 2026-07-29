const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteMyNotification,
} = require('../controllers/notification.controller');

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteMyNotification);

module.exports = router;
