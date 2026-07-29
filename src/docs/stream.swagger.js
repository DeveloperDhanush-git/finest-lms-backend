/**
 * @swagger
 * tags:
 *   name: Stream
 *   description: HLS video streaming APIs for enrolled students
 *
 * components:
 *   schemas:
 *     VideoResolution:
 *       type: object
 *       properties:
 *         quality:
 *           type: string
 *           description: Resolution label (e.g. 360p, 720p, 1080p)
 *           example: 720p
 *         playlist:
 *           type: string
 *           description: URL to the HLS variant playlist for this resolution
 *           example: https://res.cloudinary.com/demo/video/upload/sp_hd/v1631234567/lectures/abc123/720p.m3u8
 *
 *     VideoMetadata:
 *       type: object
 *       properties:
 *         width:
 *           type: number
 *           example: 1280
 *         height:
 *           type: number
 *           example: 720
 *         fps:
 *           type: number
 *           example: 30
 *         codec:
 *           type: string
 *           example: h264
 *         bitrate:
 *           type: number
 *           example: 2800000
 *         duration:
 *           type: number
 *           description: Duration in seconds
 *           example: 720
 *
 *     LectureStream:
 *       type: object
 *       properties:
 *         lectureId:
 *           type: string
 *           example: 64d4e5f6a7b8c9d0e1f2a3b4
 *         title:
 *           type: string
 *           example: Introduction to Variables
 *         duration:
 *           type: number
 *           description: Lecture duration in minutes
 *           example: 12
 *         isPreview:
 *           type: boolean
 *           description: If true, enrollment is not required to access this stream
 *           example: false
 *         thumbnail:
 *           type: string
 *           nullable: true
 *           description: URL of the video thumbnail
 *           example: https://res.cloudinary.com/demo/image/upload/v1631234567/lectures/abc123/thumbnail.jpg
 *         metadata:
 *           $ref: '#/components/schemas/VideoMetadata'
 *         resolutions:
 *           type: array
 *           description: Available HLS variant streams
 *           items:
 *             $ref: '#/components/schemas/VideoResolution'
 *         streamUrl:
 *           type: string
 *           description: URL to the HLS master playlist (.m3u8) — use this with any HLS-compatible player
 *           example: https://res.cloudinary.com/demo/video/upload/sp_auto/v1631234567/lectures/abc123/master.m3u8
 */

/**
 * @swagger
 * /stream/lecture/{lectureId}:
 *   get:
 *     summary: Get HLS stream URLs for a lecture
 *     description: |
 *             Returns a secure stream URL for a lecture video.
 *             This endpoint exists to provide protected playback access to enrolled students.
 *             Frontend usage:
 *               - Video player page when the student plays a lecture
 *     tags: [Stream]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lectureId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the lecture to stream
 *         example: 64d4e5f6a7b8c9d0e1f2a3b4
 *     responses:
 *       200:
 *         description: Stream information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LectureStream'
 *             example:
 *               success: true
 *               data:
 *                 lectureId: 64d4e5f6a7b8c9d0e1f2a3b4
 *                 title: Introduction to Variables
 *                 duration: 12
 *                 isPreview: false
 *                 thumbnail: https://res.cloudinary.com/demo/image/upload/v1631234567/lectures/abc123/thumbnail.jpg
 *                 metadata:
 *                   width: 1280
 *                   height: 720
 *                   fps: 30
 *                   codec: h264
 *                   bitrate: 2800000
 *                   size: 104857600
 *                 resolutions:
 *                   - resolution: 360p
 *                     bandwidth: 800000
 *                     playlistUrl: https://res.cloudinary.com/demo/video/upload/sp_sd/v1631234567/lectures/abc123/360p.m3u8
 *                   - resolution: 720p
 *                     bandwidth: 2800000
 *                     playlistUrl: https://res.cloudinary.com/demo/video/upload/sp_hd/v1631234567/lectures/abc123/720p.m3u8
 *                 streamUrl: https://res.cloudinary.com/demo/video/upload/sp_auto/v1631234567/lectures/abc123/master.m3u8
 *       400:
 *         description: Video is still processing or transcoding failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               videoProcessing:
 *                 summary: Video is still being transcoded
 *                 value:
 *                   success: false
 *                   message: Video is still processing.
 *               videoFailed:
 *                 summary: Video transcoding failed
 *                 value:
 *                   success: false
 *                   message: Video processing failed.
 *       401:
 *         description: Unauthorized — missing or invalid JWT access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Authentication required
 *       403:
 *         description: Forbidden — user is not enrolled in this course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: You are not enrolled in this course.
 *       404:
 *         description: Lecture, course, or master playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               lectureNotFound:
 *                 summary: Lecture does not exist or is deleted
 *                 value:
 *                   success: false
 *                   message: Lecture not found
 *               courseNotFound:
 *                 summary: Parent course not found or not published
 *                 value:
 *                   success: false
 *                   message: Course not found
 *               playlistNotFound:
 *                 summary: Master playlist URL is missing
 *                 value:
 *                   success: false
 *                   message: Master playlist not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
