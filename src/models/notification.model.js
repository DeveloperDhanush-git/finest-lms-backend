const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    type: {
      type: String,
      enum: [
        'COURSE_APPROVED',
        'COURSE_REJECTED',
        'COURSE_SUBMITTED',
        'NEW_ENROLLMENT',
        'NEW_REVIEW',
        'COURSE_COMPLETED',
        'CERTIFICATE_GENERATED',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'ANNOUNCEMENT',
        'SYSTEM',
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model('Notification', notificationSchema);
