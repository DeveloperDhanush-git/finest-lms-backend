/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Dhanush
 *
 *               lastName:
 *                 type: string
 *                 example: Don
 *
 *               email:
 *                 type: string
 *                 example: dhanush@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: Password@123
 *
 *     responses:
 *       201:
 *         description: User Registered Successfully
 *
 *       400:
 *         description: Validation Error
 *
 *       409:
 *         description: User Already Exists
 */