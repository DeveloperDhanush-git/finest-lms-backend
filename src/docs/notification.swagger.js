/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification management APIs
 *
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64e1f2b3c4d5e6f7a8b9c0d1
 *         recipientId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         senderId:
 *           type: object
 *           nullable: true
 *           properties:
 *             _id:
 *               type: string
 *               example: 64b2c3d4e5f6a7b8c9d0e1f2
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             avatar:
 *               type: string
 *               example: https://cloudfront.url/avatar.jpg
 *         type:
 *           type: string
 *           enum:
 *             - COURSE_APPROVED
 *             - COURSE_REJECTED
 *             - COURSE_SUBMITTED
 *             - NEW_ENROLLMENT
 *             - NEW_REVIEW
 *             - COURSE_COMPLETED
 *             - CERTIFICATE_GENERATED
 *             - PAYMENT_SUCCESS
 *             - PAYMENT_FAILED
 *             - ANNOUNCEMENT
 *             - SYSTEM
 *           example: NEW_ENROLLMENT
 *         title:
 *           type: string
 *           example: New Enrollment
 *         message:
 *           type: string
 *           example: A student has enrolled in your course.
 *         data:
 *           type: object
 *           example: { courseId: "64b2c3d4e5f6a7b8c9d0e1f2" }
 *         isRead:
 *           type: boolean
 *           example: false
 *         readAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-15T09:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-15T09:00:00.000Z
 *
 *     NotificationListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Notifications retrieved successfully.
 *         data:
 *           type: object
 *           properties:
 *             notifications:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalNotifications:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *
 *     UnreadCountResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Unread notification count retrieved successfully.
 *         data:
 *           type: object
 *           properties:
 *             unreadCount:
 *               type: integer
 *               example: 5
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get paginated list of my notifications
 *     description: Retrieve all notifications for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Notifications limit per page
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter notifications by read status
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     description: Retrieve the count of unread notifications for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnreadCountResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: Mark all unread notifications of the authenticated user as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All notifications marked as read successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     description: Mark a specific notification for the authenticated user as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification marked as read successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Delete a specific notification for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Notification deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
