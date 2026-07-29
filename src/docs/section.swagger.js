/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Course section management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64c3d4e5f6a7b8c9d0e1f2a3
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         title:
 *           type: string
 *           example: JavaScript Fundamentals
 *         description:
 *           type: string
 *           nullable: true
 *           example: Learn the core concepts of JavaScript including variables, data types, and functions
 *         order:
 *           type: number
 *           example: 1
 *         totalDuration:
 *           type: number
 *           description: Total duration in minutes
 *           example: 240
 *         totalLectures:
 *           type: number
 *           example: 12
 *         isPublished:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-10T04:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-17T12:00:00.000Z
 *
 *     CreateSectionRequest:
 *       type: object
 *       required:
 *         - title
 *         - order
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 200
 *           example: Advanced Functions
 *         description:
 *           type: string
 *           example: Master arrow functions, higher-order functions, and closures
 *         order:
 *           type: number
 *           example: 2
 *         isPublished:
 *           type: boolean
 *           example: false
 *
 *     UpdateSectionRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Advanced Functions and Closures
 *         description:
 *           type: string
 *           example: Deep dive into advanced function concepts
 *         order:
 *           type: number
 *           example: 3
 *         isPublished:
 *           type: boolean
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Section not found
 */

/**
 * @swagger
 * /sections/course/{courseId}:
 *   post:
 *     summary: Create a new section in a course
 *     description: |
 *             Creates a new section inside a course.
 *             This endpoint exists so instructors can organize lessons into sections.
 *             Frontend usage:
 *               - Add section form in course builder
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSectionRequest'
 *     responses:
 *       201:
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *       400:
 *         description: Validation error or duplicate order
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
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: Get all sections in a course
 *     description: Retrieves all non-deleted sections in a course, sorted by order
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: List of sections
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
 *                     $ref: '#/components/schemas/Section'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /sections/{id}:
 *   patch:
 *     summary: Update a section
 *     description: |
 *             Updates an existing course section.
 *             This endpoint exists to edit section titles, descriptions, and order.
 *             Frontend usage:
 *               - Section edit form in course editor
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: 64c3d4e5f6a7b8c9d0e1f2a3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSectionRequest'
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *       400:
 *         description: Validation error or duplicate order
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
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a section
 *     description: |
 *             Deletes a course section and its lectures.
 *             This endpoint exists to remove obsolete sections from a course.
 *             Frontend usage:
 *               - Delete section option in course manager
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *         example: 64c3d4e5f6a7b8c9d0e1f2a3
 *     responses:
 *       200:
 *         description: Section deleted successfully
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
 *                   example: Section deleted successfully
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
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
