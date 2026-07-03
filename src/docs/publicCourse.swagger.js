/**
 * @swagger
 * tags:
 *   name: Public Courses
 *   description: Public course discovery APIs
 * 
 * components:
 *   schemas:
 *     PublicCourseListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Course'
 * 
 *     PublicCourseResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Course'
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Course not found
 */

/**
 * @swagger
 * /public/courses:
 *   get:
 *     summary: List public courses
 *     description: |
 *             Returns publicly available courses for browsing.
 *             This endpoint exists to populate the public catalog and search pages.
 *             Frontend usage:
 *               - Public course listing and search pages
 *     tags: [Public Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search phrase for course title, subtitle, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID or slug
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
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of public courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicCourseListResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /public/courses/{id}:
 *   get:
 *     summary: Get public course details
 *     description: |
 *             Retrieves public course details by ID.
 *             This endpoint exists to show the course landing page to visitors and prospective students.
 *             Frontend usage:
 *               - Public course detail page
 *     tags: [Public Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Public course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicCourseResponse'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
