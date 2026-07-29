/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment checkout, verification, and history endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCheckoutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Checkout created successfully.
 *         data:
 *           type: object
 *           properties:
 *             paymentId:
 *               type: string
 *               example: 64c3d4e5f6a7b8c9d0e1f2a
 *             orderId:
 *               type: string
 *               example: order_DBJ5f1nfsH2c9X
 *             amount:
 *               type: number
 *               example: 49900
 *             currency:
 *               type: string
 *               example: INR
 *             key:
 *               type: string
 *               example: rzp_test_1a2b3c4d5e6f7g
 *
 *     VerifyPaymentRequest:
 *       type: object
 *       required:
 *         - razorpay_order_id
 *         - razorpay_payment_id
 *         - razorpay_signature
 *       properties:
 *         razorpay_order_id:
 *           type: string
 *           example: order_DBJ5f1nfsH2c9X
 *         razorpay_payment_id:
 *           type: string
 *           example: pay_DBJ5f1nfsH2c9X
 *         razorpay_signature:
 *           type: string
 *           example: 6b7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q
 *
 *     VerifyPaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Payment verified successfully.
 *         data:
 *           type: object
 *           properties:
 *             paymentId:
 *               type: string
 *               example: 64c3d4e5f6a7b8c9d0e1f2a
 *             orderId:
 *               type: string
 *               example: order_DBJ5f1nfsH2c9X
 *             paymentIdRazorpay:
 *               type: string
 *               example: pay_DBJ5f1nfsH2c9X
 *             status:
 *               type: string
 *               example: paid
 *             paidAt:
 *               type: string
 *               format: date-time
 *               example: 2026-06-20T15:45:00.000Z
 *
 *     PaymentSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64c3d4e5f6a7b8c9d0e1f2a
 *         studentId:
 *           type: string
 *           example: 64a3b4c5d6e7f8g9h0i1j2k3
 *         razorpayOrderId:
 *           type: string
 *           example: order_DBJ5f1nfsH2c9X
 *         razorpayPaymentId:
 *           type: string
 *           example: pay_DBJ5f1nfsH2c9X
 *         status:
 *           type: string
 *           example: paid
 *         amount:
 *           type: number
 *           example: 49900
 *         currency:
 *           type: string
 *           example: INR
 *         paidAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T15:45:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T15:40:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-06-20T15:45:00.000Z
 *
 *     PaymentHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentSummary'
 *
 *     PaymentDetailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/PaymentSummary'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid request or authentication error
 */

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Create a Razorpay checkout order
 *     description: |
 *             Creates a payment checkout order and returns Razorpay order details.
 *             This endpoint exists to start the purchase flow before payment completion.
 *             Frontend usage:
 *               - Checkout page to initialize payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCheckoutResponse'
 *       401:
 *         description: Unauthorized - invalid token or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can create checkout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify Razorpay payment
 *     description: |
 *             Verifies Razorpay payment data and records the transaction.
 *             This endpoint exists to confirm the payment and update user access.
 *             Frontend usage:
 *               - Payment success callback after checkout
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPaymentRequest'
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyPaymentResponse'
 *       400:
 *         description: Validation error or invalid Razorpay signature
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid token or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can verify payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get payment history for the authenticated student
 *     description: |
 *             Retrieves the authenticated student's payment history.
 *             This endpoint exists to show past purchases and receipts.
 *             Frontend usage:
 *               - Payment history or orders page
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentHistoryResponse'
 *       401:
 *         description: Unauthorized - invalid token or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can access payment history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment details by ID
 *     description: |
 *             Retrieves details for a single payment.
 *             This endpoint exists to inspect one transaction or invoice.
 *             Frontend usage:
 *               - Payment detail view
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment document ID
 *     responses:
 *       200:
 *         description: Payment details returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentDetailResponse'
 *       401:
 *         description: Unauthorized - invalid token or missing authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only students can access this payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Razorpay webhook endpoint
 *     description: |
 *             Receives Razorpay webhook events for asynchronous payment updates.
 *             This endpoint exists to process provider notifications without frontend involvement.
 *             Frontend usage:
 *               - None: used by Razorpay server callbacks only
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
