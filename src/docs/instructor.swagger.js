/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Instructor profile and onboarding APIs
 *
 * components:
 *   schemas:
 *     InstructorProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         userId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         headline:
 *           type: string
 *           example: Senior Full Stack Developer & UI/UX Enthusiast
 *         biography:
 *           type: string
 *           example: "With over 10 years of experience in the industry, I specialize in building scalable web applications using modern technologies like React, Node.js, and MongoDB."
 *         website:
 *           type: string
 *           format: uri
 *           example: https://johndoe.dev
 *         linkedin:
 *           type: string
 *           format: uri
 *           example: https://linkedin.com/in/johndoe
 *         twitter:
 *           type: string
 *           format: uri
 *           example: https://twitter.com/johndoe
 *         youtube:
 *           type: string
 *           format: uri
 *           example: https://youtube.com/c/johndoe
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *           example: ["JavaScript", "Cloud Architecture", "System Design"]
 *         totalCourses:
 *           type: number
 *           example: 5
 *         totalStudents:
 *           type: number
 *           example: 1250
 *         averageRating:
 *           type: number
 *           example: 4.8
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-10T04:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-17T12:00:00.000Z

 *
 *     CreateInstructorRequest:
 *       type: object
 *       required:
 *         - headline
 *         - biography
 *       properties:
 *         headline:
 *           type: string
 *           minLength: 5
 *           maxLength: 120
 *           example: Senior Developer & Tech Lead
 *         biography:
 *           type: string
 *           minLength: 20
 *           example: "I have been working in the tech industry for over 10 years, specializing in full-stack development..."
 *         website:
 *           type: string
 *           format: uri
 *           example: https://johndoe.dev
 *         linkedin:
 *           type: string
 *           format: uri
 *           example: https://linkedin.com/in/johndoe
 *         twitter:
 *           type: string
 *           format: uri
 *           example: https://twitter.com/johndoe
 *         youtube:
 *           type: string
 *           format: uri
 *           example: https://youtube.com/c/johndoe
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *           example: ["JavaScript", "Node.js", "React"]

 *
 *
 */

/**
 * @swagger
 * /instructors/become-instructor:
 *   post:
 *     summary: Become an instructor (Submit details and get tokens)
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstructorRequest'
 *     responses:
 *       200:
 *         description: Successfully became an instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     profile:
 *                       $ref: '#/components/schemas/InstructorProfile'
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string

 *       401:
 *         description: Unauthorized
 *
 * /instructors/profile:
 *   get:
 *     summary: Get current instructor profile
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InstructorProfile'
 *       404:
 *         description: Profile not found
 *
 *   patch:
 *     summary: Update instructor profile
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstructorRequest'
 *     responses:
 *       200:
 *         description: Profile updated
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
 *                   example: Instructor profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/InstructorProfile'
 *       400:
 *         description: Validation error
 */
