/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management APIs
 *
 * components:
 *   schemas:
 *     UserProfileData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 6a27fb3ba32d70b3dac8eda7
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           example: student
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: null
 *         phone:
 *           type: string
 *           nullable: true
 *           example: null
 *         countryCode:
 *           type: string
 *           example: +91
 *         accountStatus:
 *           type: string
 *           example: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-09T11:38:35.631Z
 *
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Profile fetched successfully
 *         data:
 *           $ref: '#/components/schemas/UserProfileData'
 *
 *     UserProfileUpdateRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Doe
 *         phone:
 *           type: string
 *           minLength: 10
 *           maxLength: 15
 *           example: 9876543210
 *         avatar:
 *           type: string
 *           format: uri
 *           example: https://example.com/avatar.png
 *
 *     AccountDeletedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Account deleted successfully
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile details.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: Unauthorized or invalid token
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
 *
 *   patch:
 *     summary: Update current user profile
 *     description: Updates the authenticated user's profile fields.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdateRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileData'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or invalid token
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
 *
 *   delete:
 *     summary: Delete current user profile
 *     description: Soft deletes the authenticated user's account and revokes refresh tokens.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountDeletedResponse'
 *       401:
 *         description: Unauthorized or invalid token
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
