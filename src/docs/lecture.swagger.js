/**
 * @swagger
 * tags:
 *   name: Lectures
 *   description: Lecture management APIs within sections
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lecture:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64d4e5f6a7b8c9d0e1f2a3b4
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         sectionId:
 *           type: string
 *           example: 64c3d4e5f6a7b8c9d0e1f2a3
 *         title:
 *           type: string
 *           example: Introduction to Variables
 *         description:
 *           type: string
 *           nullable: true
 *           example: Learn how to declare and use variables in JavaScript
 *         videoUrl:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/videos/lecture-1-intro-variables.mp4
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *           example: 12
 *         order:
 *           type: number
 *           example: 1
 *         isPreview:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         resources:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lecture Slides
 *               url:
 *                 type: string
 *                 example: https://cdn.example.com/resources/lecture-1-slides.pdf
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-10T04:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-17T12:00:00.000Z
 *
 *     CreateLectureRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - sectionId
 *         - title
 *         - order
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         sectionId:
 *           type: string
 *           example: 64c3d4e5f6a7b8c9d0e1f2a3
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 500
 *           example: Advanced Closures and Scope
 *         description:
 *           type: string
 *           example: Understanding lexical scope and closure in JavaScript
 *         videoUrl:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/videos/lecture-3-closures.mp4
 *         duration:
 *           type: number
 *           minimum: 0
 *           example: 18
 *         order:
 *           type: number
 *           example: 3
 *         isPreview:
 *           type: boolean
 *           example: false
 *         resources:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Code Examples
 *               url:
 *                 type: string
 *                 example: https://cdn.example.com/resources/closure-examples.zip
 *
 *     UpdateLectureRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Advanced Closures, Scope, and Context
 *         description:
 *           type: string
 *           example: Deep dive into closures, scope chains, and 'this' binding
 *         videoUrl:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/videos/lecture-3-closures-updated.mp4
 *         duration:
 *           type: number
 *           minimum: 0
 *           example: 25
 *         order:
 *           type: number
 *           example: 4
 *         isPreview:
 *           type: boolean
 *           example: true
 *         resources:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Lecture not found
 */

/**
 * @swagger
 * /lectures:
 *   post:
 *     summary: Create a new lecture
 *     description: Creates a new lecture within a section. Only the course owner (instructor) can create lectures. Updates course and section lecture counts and duration.
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLectureRequest'
 *     responses:
 *       201:
 *         description: Lecture created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - user is not the course owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Course or section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /lectures/section/{sectionId}:
 *   get:
 *     summary: Get all lectures in a section
 *     description: Retrieves all non-deleted lectures in a section, sorted by order
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: 64c3d4e5f6a7b8c9d0e1f2a3
 *     responses:
 *       200:
 *         description: List of lectures
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
 *                     $ref: '#/components/schemas/Lecture'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /lectures/{id}:
 *   patch:
 *     summary: Update a lecture
 *     description: Updates a lecture. Only the course owner (instructor) can update lectures. Automatically recalculates course and section duration if lecture duration changes.
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *         example: 64d4e5f6a7b8c9d0e1f2a3b4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLectureRequest'
 *     responses:
 *       200:
 *         description: Lecture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lecture'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - user is not the course owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lecture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a lecture
 *     description: Soft deletes a lecture and automatically updates course and section statistics (lecture count and duration).
 *     tags: [Lectures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture ID
 *         example: 64d4e5f6a7b8c9d0e1f2a3b4
 *     responses:
 *       200:
 *         description: Lecture deleted successfully
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
 *                   example: Lecture deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - user is not the course owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lecture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
