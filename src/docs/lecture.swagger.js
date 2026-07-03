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
 *         video:
 *           type: object
 *           properties:
 *             original:
 *               type: string
 *               nullable: true
 *               example: uploads/video.mp4
 *             masterPlaylist:
 *               type: string
 *               nullable: true
 *               example: https://cdn.example.com/videos/lecture-1/master.m3u8
 *             s3Prefix:
 *               type: string
 *               nullable: true
 *               example: lectures/videos/lecture-1
 *             thumbnail:
 *               type: string
 *               nullable: true
 *               example: https://cdn.example.com/videos/lecture-1/thumbnail.jpg
 *             processingStatus:
 *               type: string
 *               enum: [pending, processing, completed, failed]
 *               example: completed
 *             processingError:
 *               type: string
 *               nullable: true
 *               example: null
 *             resolutions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   quality:
 *                     type: string
 *                     example: 720p
 *                   playlist:
 *                     type: string
 *                     example: https://cdn.example.com/videos/lecture-1/720p.m3u8
 *             metadata:
 *               type: object
 *               nullable: true
 *               properties:
 *                 width:
 *                   type: number
 *                   example: 1280
 *                 height:
 *                   type: number
 *                   example: 720
 *                 duration:
 *                   type: number
 *                   example: 12
 *                 bitrate:
 *                   type: number
 *                   example: 2800000
 *                 codec:
 *                   type: string
 *                   example: h264
 *                 fps:
 *                   type: number
 *                   example: 30
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
 *         videoPublicId:
 *           type: string
 *           example: temp/abcd
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
 *         videoPublicId:
 *           type: string
 *           example: temp/abcd
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
 *     description: |
 *             Creates a new lecture within a course section.
 *             This endpoint exists so instructors can add lesson content to their course.
 *             Frontend usage:
 *               - Add lecture form in course editor
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
 *     description: |
 *             Lists all lectures in a section.
 *             This endpoint exists to retrieve the course structure for an instructor or student.
 *             Frontend usage:
 *               - Section detail page showing lectures
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
 *     description: |
 *             Updates lecture metadata such as title or description.
 *             This endpoint exists to allow editing lecture content details.
 *             Frontend usage:
 *               - Lecture edit screen
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

/**
 * @swagger
 * /lectures/{id}/video:
 *   post:
 *     summary: Upload lecture video
 *     description: |
 *             Uploads or replaces a lecture's video file.
 *             This endpoint exists to attach the actual lesson media to a lecture.
 *             Frontend usage:
 *               - Lecture video upload in course builder
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: Video uploaded successfully. Processing started.
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
 *                   example: Video uploaded successfully. Processing started.
 *                 data:
 *                   type: object
 *                   properties:
 *                     lectureId:
 *                       type: string
 *                       example: 64d4e5f6a7b8c9d0e1f2a3b4
 *                     processingStatus:
 *                       type: string
 *                       example: processing
 *
 * /lectures/{id}/resource:
 *   post:
 *     summary: Upload lecture resource
 *     description: |
 *             Uploads a lecture resource file.
 *             This endpoint exists to attach documents or supplements to a lecture.
 *             Frontend usage:
 *               - Add resource action in lecture editor
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resource uploaded successfully
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
 *                   example: Resource uploaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/Lecture'
 */

/**
 * @swagger
 * /lectures/{id}/video:
 *   delete:
 *     summary: Remove lecture video
 *     description: |
 *             Deletes a lecture video.
 *             This endpoint exists to remove or replace a bad video upload.
 *             Frontend usage:
 *               - Remove video action in lecture management
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
 *     responses:
 *       200:
 *         description: Video removed successfully
 *
 * /lectures/{id}/resource/{resourceId}:
 *   delete:
 *     summary: Remove a lecture resource
 *     description: |
 *             Deletes a resource attached to a lecture.
 *             This endpoint exists to keep lecture materials up to date and remove unwanted files.
 *             Frontend usage:
 *               - Delete lecture resource action
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
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID (from the resources array)
 *     responses:
 *       200:
 *         description: Resource removed successfully
 * 
 * /lectures/{id}/video/status:
 *   get:
 *     summary: Get video transcoding status for a lecture
 *     description: |
 *             Checks the status of a lecture video upload or processing.
 *             This endpoint exists to let the frontend poll for readiness of video assets.
 *             Frontend usage:
 *               - Upload progress/status indicator for lecture videos
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
 *     responses:
 *       200:
 *         description: Video status retrieved successfully
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
 *                     lectureId:
 *                       type: string
 *                       example: 64d4e5f6a7b8c9d0e1f2a3b4
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed]
 *                       example: completed
 *                     error:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     streamUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://cdn.example.com/videos/lecture-1/master.m3u8
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lecture not found
 */
