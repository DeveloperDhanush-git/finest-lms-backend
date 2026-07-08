/**
 * @swagger
 * tags:
 *   name: Dashboards
 *   description: Student, instructor, and admin dashboard summary endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStatistics:
 *       type: object
 *       properties:
 *         enrolledCourses:
 *           type: integer
 *           example: 8
 *         completedCourses:
 *           type: integer
 *           example: 3
 *         inProgressCourses:
 *           type: integer
 *           example: 5
 *         certificates:
 *           type: integer
 *           example: 2
 *         learningHours:
 *           type: number
 *           example: 24.5
 *
 *     StudentDashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             statistics:
 *               $ref: '#/components/schemas/DashboardStatistics'
 *             continueLearning:
 *               type: array
 *               items:
 *                 type: object
 *             recentCertificates:
 *               type: array
 *               items:
 *                 type: object
 *             recentReviews:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /dashboard/student:
 *   get:
 *     summary: Get the authenticated student's dashboard summary
 *     description: Returns statistics and recent learning activity for the current student.
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentDashboardResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /instructor/dashboard:
 *   get:
 *     summary: Get the authenticated instructor dashboard summary
 *     description: Returns course, enrollment, revenue, and review metrics for the current instructor.
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get the admin dashboard summary
 *     description: Returns platform-wide analytics for administrators.
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
