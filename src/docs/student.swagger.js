/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student learning, course access, and progress endpoints
 *
 * components:
 *   schemas:
 *     StudentCourseSummary:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         title:
 *           type: string
 *           example: Complete JavaScript Bootcamp
 *         progressPercentage:
 *           type: number
 *           example: 40
 *         nextLectureId:
 *           type: string
 *           nullable: true
 *           example: 64d4e5f6a7b8c9d0e1f2a3b4
 *
 *     StudentCourseDetails:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         progressPercentage:
 *           type: number
 *         curriculum:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sectionId:
 *                 type: string
 *               title:
 *                 type: string
 *               lectures:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lectureId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *
 *     StudentLectureResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             lectureId:
 *               type: string
 *             title:
 *               type: string
 *             content:
 *               type: string
 *             duration:
 *               type: number
 *             completed:
 *               type: boolean
 *
 *     ProgressUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Progress updated successfully
 *         data:
 *           type: object
 *           properties:
 *             progressPercentage:
 *               type: number
 *               example: 45
 */

/**
 * @swagger
 * /student/my-learning:
 *   get:
 *     summary: Get all active courses for the authenticated student
 *     description: |
 *             Retrieves the authenticated student's active learning courses.
 *             Frontend usage:
 *               - Student dashboard
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student learning list retrieved successfully
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
 *                     $ref: '#/components/schemas/StudentCourseSummary'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /student/course/{courseId}:
 *   get:
 *     summary: Get detailed course access information for the student
 *     description: |
 *             Retrieves course details and access information for a student.
 *             Frontend usage:
 *               - Course detail page in student dashboard
 *     tags: [Student]
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
 *         description: Course access details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/StudentCourseDetails'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found or inaccessible
 */

/**
 * @swagger
 * /student/course/{courseId}/curriculum:
 *   get:
 *     summary: Get the curriculum structure for a course
 *     description: |
 *             Retrieves all course sections and lectures for a student.
 *             Frontend usage:
 *               - Curriculum tab for enrolled courses
 *     tags: [Student]
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
 *         description: Curriculum retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       sectionId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       lectures:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             lectureId:
 *                               type: string
 *                             title:
 *                               type: string
 *                             completed:
 *                               type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /student/course/{courseId}/lecture/{lectureId}:
 *   get:
 *     summary: Get details for a single lecture in a course
 *     description: |
 *             Retrieves specific lecture details for an enrolled student.
 *             Frontend usage:
 *               - Lecture playback page
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Lecture details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentLectureResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lecture not found
 */

/**
 * @swagger
 * /student/course/{courseId}/lecture/{lectureId}/progress:
 *   patch:
 *     summary: Update a student's lecture progress
 *     description: |
 *             Marks a lecture as watched or updates progress.
 *             Frontend usage:
 *               - Lecture completion actions
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressUpdateResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lecture or course not found
 */

/**
 * @swagger
 * /student/course/{courseId}/progress:
 *   get:
 *     summary: Get course progress for the student
 *     description: |
 *             Retrieves the student's progress for a specific course.
 *             Frontend usage:
 *               - Progress tracking page
 *     tags: [Student]
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
 *         description: Course progress retrieved successfully
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
 *                     progressPercentage:
 *                       type: number
 *                       example: 40
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /student/course/{courseId}/resume:
 *   get:
 *     summary: Get resume lecture for a course
 *     description: |
 *             Retrieves the lecture where the student last left off.
 *             Frontend usage:
 *               - Resume button on course page
 *     tags: [Student]
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
 *         description: Resume lecture retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/StudentLectureResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /student/course/{courseId}/complete:
 *   post:
 *     summary: Mark a course as complete
 *     description: |
 *             Marks the authenticated student's course as complete.
 *             Frontend usage:
 *               - Course completion flow
 *     tags: [Student]
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
 *         description: Course completed successfully
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
 *                   example: Course completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
