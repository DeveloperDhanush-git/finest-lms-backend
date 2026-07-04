/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment and access check endpoints
 *
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64e5f6a7b8c9d0e1f2a3b4c5
 *         studentId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-25T10:30:00.000Z
 *         status:
 *           type: string
 *           enum: [active, completed, cancelled]
 *           example: active
 *         progressPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 45
 *
 *     EnrolledCourseDetail:
 *       type: object
 *       properties:
 *         enrollment:
 *           $ref: '#/components/schemas/Enrollment'
 *         course:
 *           type: object
 *           description: Course details object
 *
 *     EnrollmentListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Enrollment'
 */

/**
 * @swagger
 * /enrollments/{courseId}:
 *   post:
 *     summary: Enroll the authenticated student in a course
 *     description: |
 *             Enrolls the authenticated student in the specified course.
 *             Frontend usage:
 *               - Enroll button on course detail or checkout pages
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID to enroll in
 *     responses:
 *       201:
 *         description: Course enrolled successfully
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
 *                   example: Course enrolled successfully
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Already enrolled or invalid courseId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /enrollments/my-courses:
 *   get:
 *     summary: Get the authenticated student's enrolled courses
 *     description: |
 *             Lists enrolled courses for the authenticated student.
 *             Frontend usage:
 *               - Student dashboard enrolled courses list
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student enrollments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EnrollmentListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /enrollments/check/{courseId}:
 *   get:
 *     summary: Check enrollment status for a course
 *     description: |
 *             Checks whether the authenticated student is enrolled in the specified course.
 *             Frontend usage:
 *               - Conditional enroll/continue actions on course pages
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment status returned successfully
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
 *                     isEnrolled:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
