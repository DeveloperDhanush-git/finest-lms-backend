/**
 * @swagger
 * tags:
 *   name: Admin Courses
 *   description: Admin course review and approval endpoints
 */

/**
 * @swagger
 * /admin/courses/pending:
 *   get:
 *     summary: Get pending courses for review
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending courses returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminCourseListItem'
 */

/**
 * @swagger
 * /admin/courses/{courseId}:
 *   get:
 *     summary: Get a course for admin review
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details returned successfully
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
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *                     sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                     lectures:
 *                       type: array
 *                       items:
 *                         type: object
 *                     studentCount:
 *                       type: number
 *                       example: 12
 */

/**
 * @swagger
 * /admin/courses/{courseId}/approve:
 *   patch:
 *     summary: Approve a pending course
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course approved successfully
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
 *                   example: Course approved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /admin/courses/{courseId}/reject:
 *   patch:
 *     summary: Reject a pending course
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: Course thumbnail quality is poor
 *     responses:
 *       200:
 *         description: Course rejected successfully
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
 *                   example: Course rejected successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCourseListItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, pending, published, rejected]
 *         thumbnail:
 *           type: string
 *           nullable: true
 *         categoryId:
 *           type: object
 *         instructorId:
 *           type: object
 *         studentCount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */
