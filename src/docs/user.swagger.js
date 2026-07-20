/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management APIs
 *
 * components:
 *   schemas:
 *     UserProfileData:
 *       $ref: '#/components/schemas/User'
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
 *           minLength: 1
 *           maxLength: 50
 *           example: John
 *         lastName:
 *           type: string
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
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           example: OldSecurePass@123
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 8
 *           maxLength: 30
 *           example: NewSecurePass@456
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: NewSecurePass@456
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: |
 *             Fetches the authenticated user's profile details.
 *             This endpoint exists so the frontend can display the user's account information.
 *             Frontend usage:
 *               - Profile page
 *               - Account summary in the dashboard
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
 *     description: |
 *             Updates the authenticated user's profile data.
 *             This endpoint exists so users can edit and save their personal information.
 *             Frontend usage:
 *               - Edit profile form submissions
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
 *     description: |
 *             Soft deletes the authenticated user's account and removes access.
 *             This endpoint exists to support account deletion requests.
 *             Frontend usage:
 *               - Account removal option in settings
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

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Update user avatar
 *     description: |
 *             Uploads or updates the authenticated user's avatar image.
 *             This endpoint exists to let users personalize their profile picture.
 *             Frontend usage:
 *               - Profile picture upload action
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
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
 *                   example: Avatar updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v1631234567/profiles/abc123.jpg
 *                     avatarKey:
 *                       type: string
 *                       example: profiles/abc123
 */

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     summary: Remove user avatar
 *     description: |
 *             Removes the authenticated user's avatar image.
 *             This endpoint exists so users can clear or remove their profile photo.
 *             Frontend usage:
 *               - Remove avatar option in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 */

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change user password
 *     description: |
 *             Changes the authenticated user's password after verifying the current password.
 *             This endpoint exists to allow users to manage credentials securely.
 *             Frontend usage:
 *               - Change password page in account settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully. All sessions have been revoked.
 *       400:
 *         description: Validation error or invalid current password
 *       401:
 *         description: Unauthorized
 */

