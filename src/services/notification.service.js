const Notification = require('../models/notification.model');
const { NotFoundError } = require('../errors');
const { getIO } = require('../socket');
const { getSocketId } = require('../socket/users');

const createNotification = async (notificationData) => {
    const notificationInstance = new Notification(notificationData);
    let notification = await notificationInstance.save();

    // Populate sender details if senderId is provided
    if (notification.senderId) {
        notification = await Notification.findById(notification._id)
            .populate('senderId', 'firstName lastName avatar')
            .exec();
    }

    // Attempt to emit socket event
    try {
        const socketId = getSocketId(notification.recipientId);
        if (socketId) {
            const io = getIO();
            io.to(socketId).emit('notification', notification);
        }
    } catch (error) {
        // Gracefully handle case where socket is not initialized (e.g. in tests or worker runner)
        console.warn('Socket.IO notification emission skipped:', error.message);
    }

    return notification;
};

const getNotifications = async (recipientId, query = {}) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const mongoQuery = { recipientId };

    if (query.isRead !== undefined && query.isRead !== null) {
        // Supporting string and boolean forms
        mongoQuery.isRead = query.isRead === 'true' || query.isRead === true;
    }

    const notifications = await Notification.find(mongoQuery)
        .populate('senderId', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

    const total = await Notification.countDocuments(mongoQuery);

    return {
        notifications,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalNotifications: total,
            pageSize: limit,
        },
    };
};

const getUnreadCount = async (recipientId) => {
    const count = await Notification.countDocuments({
        recipientId,
        isRead: false,
    });
    return { unreadCount: count };
};

const markAsRead = async (notificationId, recipientId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipientId,
    });

    if (!notification) {
        throw new NotFoundError('Notification not found.');
    }

    if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();
    }

    return notification;
};

const markAllAsRead = async (recipientId) => {
    const result = await Notification.updateMany(
        { recipientId, isRead: false },
        {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        }
    );

    return {
        modifiedCount: result.modifiedCount,
    };
};

const deleteNotification = async (notificationId, recipientId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipientId,
    });

    if (!notification) {
        throw new NotFoundError('Notification not found.');
    }

    await Notification.deleteOne({ _id: notificationId });
    return notification;
};

module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
