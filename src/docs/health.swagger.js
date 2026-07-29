/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health check and availability APIs
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     description: |
 *             Returns a simple status response confirming the API is healthy.
 *             This endpoint exists for monitoring and deployment health checks.
 *             Frontend usage:
 *               - Not typically used by the frontend; used by service monitors
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server Running
 */
