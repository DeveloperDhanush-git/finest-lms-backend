/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Course review APIs for students
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64e1f2b3c4d5e6f7a8b9c0d1
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         userId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         rating:
 *           type: number
 *           example: 5
 *         review:
 *           type: string
 *           example: This course was excellent and well structured.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-01T09:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-02T12:00:00.000Z
 *
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - rating
 *         - review
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         review:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: This course was excellent and well structured.
 *
 *     UpdateReviewRequest:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         review:
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: Updated review text.
 *
 *     ReviewListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Review'
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review for a course
 *     description: |
 *             Allows an authenticated student to submit a review for a course.
 *             Frontend usage:
 *               - Course review submission form
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *                   example: Review added successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only students can review courses
 */

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update an existing review
 *     description: |
 *             Allows an authenticated student to update their course review.
 *             Frontend usage:
 *               - Edit review form
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *
 *   delete:
 *     summary: Delete a review
 *     description: |
 *             Allows an authenticated student to delete their own course review.
 *             Frontend usage:
 *               - Delete review action
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   example: Review deleted successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/my/{courseId}:
 *   get:
 *     summary: Get the current student's review for a course
 *     description: |
 *             Fetches the authenticated student's own review for a specific course.
 *             Frontend usage:
 *               - Display user's review on course page
 *     tags: [Reviews]
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
 *         description: Review fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/course/{courseId}:
 *   get:
 *     summary: Get all reviews for a course
 *     description: |
 *             Retrieves all reviews for a specific course.
 *             Frontend usage:
 *               - Course reviews section
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for review pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of reviews to return per page
 *     responses:
 *       200:
 *         description: List of reviews returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewListResponse'
 *       404:
 *         description: Course not found
 */
