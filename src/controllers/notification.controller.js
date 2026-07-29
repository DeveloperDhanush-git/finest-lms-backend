const notificationService = require('../services/notification.service');
const { asyncHandler, success } = require('../helpers');

const getMyNotifications = asyncHandler(async (req, res) => {
    const result = await notificationService.getNotifications(req.user._id, req.query);
    return success(res, 'Notifications retrieved successfully.', result);
});

const getUnreadCount = asyncHandler(async (req, res) => {
    const result = await notificationService.getUnreadCount(req.user._id);
    return success(res, 'Unread notification count retrieved successfully.', result);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAsRead(req.params.id, req.user._id);
    return success(res, 'Notification marked as read successfully.', result);
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user._id);
    return success(res, 'All notifications marked as read successfully.', result);
});

const deleteMyNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    return success(res, 'Notification deleted successfully.');
});

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteMyNotification,
};
