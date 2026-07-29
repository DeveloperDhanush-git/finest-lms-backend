/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Certificate issuance, retrieval, download, and verification APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         studentId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         courseId:
 *           type: string
 *           example: 64a1f2b3c4d5e6f7a8b9c0d1
 *         enrollmentId:
 *           type: string
 *           example: 64c1d2e3f4a5b6c7d8e9f0a1
 *         certificateNumber:
 *           type: string
 *           example: FINEST-2026-000001
 *         verificationCode:
 *           type: string
 *           example: A1B2C3
 *         certificateUrl:
 *           type: string
 *           example: https://example.com/certificates/abc123.pdf
 *         certificateKey:
 *           type: string
 *           example: certificates/664f1a2b3c4d5e6f7a8b9c0d/abc123.pdf
 *         issuedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-06T10:30:00.000Z
 *         isRevoked:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-06T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-07-06T10:35:00.000Z
 *
 *     CertificateDownloadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: https://example.com/certificates/abc123.pdf
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Certificate not found.
 */

/**
 * @swagger
 * /certificates/course/{courseId}:
 *   post:
 *     summary: Generate a certificate for a completed course
 *     description: Creates a certificate for a student after they complete a course and meet the eligibility requirements.
 *     tags: [Certificates]
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
 *       201:
 *         description: Certificate generated successfully
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
 *                   example: Certificate generated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Certificate'
 *       400:
 *         description: Course not completed or certificate already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates for the authenticated student
 *     description: Returns certificates issued to the logged-in student.
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
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
 *                     $ref: '#/components/schemas/Certificate'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /certificates/course/{courseId}:
 *   get:
 *     summary: Get a certificate for a specific course
 *     description: Fetches the certificate issued for a given course and student.
 *     tags: [Certificates]
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
 *         description: Certificate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Certificate'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 */

/**
 * @swagger
 * /certificates/course/{courseId}/download:
 *   get:
 *     summary: Download a certificate by course
 *     description: Returns the public URL of the certificate file for download.
 *     tags: [Certificates]
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
 *         description: Download URL returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CertificateDownloadResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 */

/**
 * @swagger
 * /certificates/verify/{verificationCode}:
 *   get:
 *     summary: Verify a certificate
 *     description: Verifies the authenticity of a certificate using its verification code.
 *     tags: [Certificates]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate verification code
 *     responses:
 *       200:
 *         description: Certificate verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Certificate'
 *       404:
 *         description: Invalid certificate
 */
