/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment and student progress management APIs
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
 *         completedLectures:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64d4e5f6a7b8c9d0e1f2a3b4", "64d4e5f6a7b8c9d0e1f2a3b5"]
 *         lastAccessedLecture:
 *           type: string
 *           nullable: true
 *           example: 64d4e5f6a7b8c9d0e1f2a3b6
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-25T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-25T11:00:00.000Z
 *
 *     EnrolledCourseDetail:
 *       type: object
 *       properties:
 *         enrollment:
 *           $ref: '#/components/schemas/Enrollment'
 *         course:
 *           $ref: '#/components/schemas/Course'
 *         sections:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Section'
 *         lectures:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lecture'
 *
 *     UpdateProgressRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - lectureId
 *       properties:
 *         courseId:
 *           type: string
 *           description: ID of the course
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         lectureId:
 *           type: string
 *           description: ID of the lecture being completed
 *           example: 64d4e5f6a7b8c9d0e1f2a3b6
 */

/**
 * @swagger
 * /enrollments/{courseId}:
 *   post:
 *     summary: Enroll in a course
 *     description: |
 *             Enrolls the authenticated student in a course.
 *             This endpoint exists to grant access to the course after purchase or approval.
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
 *         description: Already enrolled or invalid course ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 *
 * /enrollments/my-courses:
 *   get:
 *     summary: Get all enrollments for current student
 *     description: |
 *             Lists the student's enrolled courses.
 *             This endpoint exists so the frontend can show active course access and learning history.
 *             Frontend usage:
 *               - Student dashboard enrolled courses list
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student enrollments
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
 *                     $ref: '#/components/schemas/Enrollment'
 *
 * /enrollments/course/{courseId}:
 *   get:
 *     summary: Get enrollment details for a specific course
 *     description: |
 *             Retrieves enrollment details for a particular course.
 *             This endpoint exists to confirm whether the student has access to the course.
 *             Frontend usage:
 *               - Course access check and lesson gating
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
 *         description: Enrollment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EnrolledCourseDetail'
 *       404:
 *         description: Enrollment not found
 *
 * /enrollments/check/{courseId}:
 *   get:
 *     summary: Check if user is enrolled in a course
 *     description: |
 *             Checks if the student is enrolled in a given course.
 *             This endpoint exists to conditionally show enroll or continue buttons.
 *             Frontend usage:
 *               - Course landing pages to display enrollment status
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
 *         description: Check result
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
 *
 * /enrollments/progress:
 *   patch:
 *     summary: Update course progress
 *     description: |
 *             Updates a student's progress for a course or lecture.
 *             This endpoint exists to record learning progress and let users resume later.
 *             Frontend usage:
 *               - Lesson completion actions
 *               - Progress tracking in dashboards
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProgressRequest'
 *     responses:
 *       200:
 *         description: Progress updated successfully
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
 *                   example: Progress updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Invalid course ID or lecture ID
 *       404:
 *         description: Enrollment record not found
 */
