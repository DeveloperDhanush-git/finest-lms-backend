/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management for students (add, view, remove courses)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         price:
 *           type: number
 *           example: 99.99
 *         addedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T10:30:00.000Z
 *
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64c3d4e5f6a7b8c9d0e1f2a3
 *         studentId:
 *           type: string
 *           example: 664f1a2b3c4d5e6f7a8b9c0d
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalItems:
 *           type: number
 *           example: 3
 *         totalAmount:
 *           type: number
 *           example: 249.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T10:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T15:45:00.000Z
 *
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           example: 64b2c3d4e5f6a7b8c9d0e1f2
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

// ─────────────────────────────────────────────────────────────────────────────
// POST /cart
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a course to the student's cart
 *     description: |
 *             Adds a course to the authenticated student's shopping cart.
 *             This endpoint exists to let students build a purchase order before paying.
 *             Frontend usage:
 *               - Add to cart button on course pages
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartRequest'
 *     responses:
 *       200:
 *         description: Course added to cart successfully
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
 *                   example: Course added to cart successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error - courseId is required or course already in cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can add courses to cart
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /cart
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the student's shopping cart
 *     description: |
 *             Retrieves the authenticated student's current shopping cart.
 *             This endpoint exists so the frontend can show cart contents and total prices.
 *             Frontend usage:
 *               - Cart page and mini cart previews
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized - user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can view their cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /cart/:courseId
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /cart/{courseId}:
 *   delete:
 *     summary: Remove a course from the student's cart
 *     description: |
 *             Removes a specific course from the student's cart.
 *             This endpoint exists to allow users to manage cart items before checkout.
 *             Frontend usage:
 *               - Remove item action in the cart list
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64b2c3d4e5f6a7b8c9d0e1f2
 *         description: The ID of the course to remove from cart
 *     responses:
 *       200:
 *         description: Course removed from cart successfully
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
 *                   example: Course removed from cart successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Course not in cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can modify their cart
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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /cart
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the entire shopping cart
 *     description: |
 *             Clears all courses from the student's cart.
 *             This endpoint exists to let users empty their cart and start over.
 *             Frontend usage:
 *               - Clear cart button on the cart page
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
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
 *                   example: Cart cleared successfully.
 *       401:
 *         description: Unauthorized - user must be authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can clear their cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
