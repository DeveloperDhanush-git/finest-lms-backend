    /**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs for instructors
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         instructorId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         categoryId:
 *           type: string
 *           example: 64a1f2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: Complete JavaScript Bootcamp 2024
 *         subtitle:
 *           type: string
 *           example: Learn JavaScript from zero to hero
 *         description:
 *           type: string
 *           example: Master JavaScript with real-world projects, from beginner to advanced. Covers ES6+, async/await, promises, and modern frameworks.
 *         thumbnail:
 *           type: string
 *           nullable: true
 *           example: https://cdn.example.com/course-thumbnails/js-bootcamp.jpg
 *         thumbnailKey:
 *           type: string
 *           nullable: true
 *           example: courses/thumbnails/64b2c3d4e5f6a7b8c9d0e1f2.jpg
 *         previewVideo:
 *           type: object
 *           nullable: true
 *           properties:
 *             url:
 *               type: string
 *               example: https://cdn.example.com/previews/js-bootcamp-preview.mp4
 *             key:
 *               type: string
 *               example: courses/previews/64b2c3d4e5f6a7b8c9d0e1f2.mp4
 *             duration:
 *               type: number
 *               example: 0
 *             size:
 *               type: number
 *               example: 10485760
 *             mimeType:
 *               type: string
 *               example: video/mp4
 *         language:
 *           type: string
 *           example: English
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, all_levels]
 *           example: beginner
 *         price:
 *           type: number
 *           example: 99.99
 *         discountPrice:
 *           type: number
 *           nullable: true
 *           example: 49.99
 *         totalDuration:
 *           type: number
 *           description: Total duration in minutes
 *           example: 1440
 *         totalLectures:
 *           type: number
 *           example: 45
 *         averageRating:
 *           type: number
 *           example: 4.8
 *         totalReviews:
 *           type: number
 *           example: 234
 *         totalEnrollments:
 *           type: number
 *           example: 5600
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           example: [Basic HTML/CSS knowledge, Text editor or IDE, Computer with internet connection]
 *         learningObjectives:
 *           type: array
 *           items:
 *             type: string
 *           example: [Understand JavaScript fundamentals, Write clean and efficient code, Build interactive web applications, Master modern ES6+ syntax]
 *         targetAudience:
 *           type: array
 *           items:
 *             type: string
 *           example: [Beginners wanting to learn programming, Career changers entering tech industry, Students needing additional learning resources]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [javascript, web-development, programming, es6, frontend]
 *         status:
 *           type: string
 *           enum: [draft, pending, published, rejected]
 *           example: published
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-15T10:30:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-10T04:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-17T12:00:00.000Z
 *
 *     CreateCourseRequest:
 *       type: object
 *       required:
 *         - categoryId
 *         - title
 *         - description
 *         - level
 *         - price
 *       properties:
 *         categoryId:
 *           type: string
 *           example: 64a1f2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 200
 *           example: Advanced React Patterns
 *         subtitle:
 *           type: string
 *           example: Master advanced React concepts and patterns
 *         description:
 *           type: string
 *           minLength: 20
 *           example: Deep dive into advanced React patterns including hooks, context, compound components, and performance optimization.
 *         language:
 *           type: string
 *           example: English
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, all_levels]
 *           example: advanced
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 79.99
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *           example: 39.99
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           example: [Solid understanding of React basics, JavaScript ES6+ knowledge]
 *         learningObjectives:
 *           type: array
 *           items:
 *             type: string
 *           example: [Master hooks and custom hooks, Understand context and Redux, Build scalable applications]
 *         targetAudience:
 *           type: array
 *           items:
 *             type: string
 *           example: [React developers looking to improve skills, Frontend engineers seeking advanced patterns]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [react, javascript, frontend, web-development]
 *
 *     UpdateCourseRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Advanced React Patterns 2024
 *         subtitle:
 *           type: string
 *           example: Master modern React patterns
 *         description:
 *           type: string
 *           example: Updated course description
 *         language:
 *           type: string
 *           example: English
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, all_levels]
 *         price:
 *           type: number
 *           minimum: 0
 *         discountPrice:
 *           type: number
 *           minimum: 0
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *         learningObjectives:
 *           type: array
 *           items:
 *             type: string
 *         targetAudience:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
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
 * /courses:
 *   post:
 *     summary: Create a new course
 *     description: |
 *             Creates a new course draft for an instructor.
 *             This endpoint exists so instructors can create and save course content.
 *             Frontend usage:
 *               - Course creation page in the instructor panel
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only instructors can create courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /courses/my-courses:
 *   get:
 *     summary: Get all courses created by the authenticated instructor
 *     description: |
 *             Lists courses created by the authenticated instructor.
 *             This endpoint exists so instructors can manage their own course catalog.
 *             Frontend usage:
 *               - Instructor dashboard course list
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructor's courses
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
 *                     $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - instructor profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /courses/search/suggestions:
 *   get:
 *     summary: Get course search suggestions
 *     description: |
 *             Retrieves keyword-based search suggestions for courses.
 *             Frontend usage:
 *               - Search autocomplete and suggestion dropdowns
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query term
 *     responses:
 *       200:
 *         description: Suggestions returned successfully
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
 *                       title:
 *                         type: string
 *                       courseId:
 *                         type: string
 *       400:
 *         description: Invalid search query
 */

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course details by ID
 *     description: |
 *             Retrieves a single course by ID for the instructor or public viewer.
 *             This endpoint exists to load course details for editing or display.
 *             Frontend usage:
 *               - Course edit page
 *               - Course preview page
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
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
 *   patch:
 *     summary: Update course details
 *     description: Updates an existing course. Only the course owner (instructor) can update their course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             $ref: '#/components/schemas/UpdateCourseRequest'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
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
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a course
 *     description: Soft deletes a course and all its sections and lectures. Only the course owner can delete their course.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: Course deleted successfully
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
 *                   example: Course deleted successfully
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
 * /courses/{id}/submit:
 *   patch:
 *     summary: Submit a course for admin review
 *     description: |
 *             Submits a course for review by changing its status to pending.
 *             The course must include a title, description, thumbnail, category, sections, lectures, requirements, and learning objectives.
 *             Frontend usage:
 *               - Submit for review button in the instructor dashboard
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: Course published successfully
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
 *                   example: Course submitted for review successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
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
 * /courses/{id}/publish:
 *   post:
 *     summary: Publish a course (Submit for review)
 *     description: |
 *             Submits a course for review by changing its status to pending (equivalent to the submit endpoint).
 *             The course must include a title, description, thumbnail, category, sections, lectures, requirements, and learning objectives.
 *             Frontend usage:
 *               - Publish button in the course editor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: Course submitted for review successfully
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
 *                   example: Course submitted for review successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
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
 * /courses/{id}/unpublish:
 *   post:
 *     summary: Unpublish a course
 *     description: |
 *             Unpublishes a live course, hiding it from new students.
 *             This endpoint exists to temporarily disable course enrollment.
 *             Frontend usage:
 *               - Unpublish action in the course management console
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *     responses:
 *       200:
 *         description: Course unpublished successfully
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
 *                   example: Course unpublished successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
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
 */

/**
 * @swagger
 * /courses/{id}/thumbnail:
 *   post:
 *     summary: Upload course thumbnail
 *     description: |
 *             Uploads or updates the course thumbnail image.
 *             This endpoint exists to attach visual branding to a course listing.
 *             Frontend usage:
 *               - Course thumbnail upload in the course builder
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail updated successfully
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
 *                   example: Thumbnail updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     thumbnail:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v1631234567/courses/thumbnails/abc.jpg
 *                     thumbnailKey:
 *                       type: string
 *                       example: courses/thumbnails/abc
 *
 * /courses/{id}/preview-video:
 *   post:
 *     summary: Upload course preview video
 *     description: |
 *             Uploads a course preview video.
 *             This endpoint exists to allow prospective students to preview the course content.
 *             Frontend usage:
 *               - Preview video upload section in the course manager
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               previewVideo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Preview video updated successfully
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
 *                   example: Preview video updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     previewVideo:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/video/upload/v1631234567/courses/previews/xyz.mp4
 *                         key:
 *                           type: string
 *                           example: courses/previews/xyz.mp4
 *                         duration:
 *                           type: number
 *                           example: 0
 *                         size:
 *                           type: number
 *                           example: 1048576
 *                         mimeType:
 *                           type: string
 *                           example: video/mp4
 */

/**
 * @swagger
 * /courses/{id}/thumbnail:
 *   delete:
 *     summary: Remove course thumbnail
 *     description: |
 *             Removes the course thumbnail image.
 *             This endpoint exists so instructors can replace or remove outdated thumbnails.
 *             Frontend usage:
 *               - Delete thumbnail action in editor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Thumbnail removed successfully
 *
 * /courses/{id}/preview-video:
 *   delete:
 *     summary: Remove course preview video
 *     description: |
 *             Deletes the course preview video.
 *             This endpoint exists so instructors can manage preview media for the course.
 *             Frontend usage:
 *               - Remove preview video action in course builder
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Preview video removed successfully
 */
