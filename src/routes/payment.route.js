const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createCheckout,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  paymentWebhook,
} = require('../controllers/payment.controller');

const { verifyPaymentSchema } = require('../validations/payment.validation');

router.post('/checkout', authMiddleware, roleMiddleware('student'), createCheckout);

router.post(
  '/verify',
  authMiddleware,
  roleMiddleware('student'),
  validate(verifyPaymentSchema),
  verifyPayment
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('student'),
  getPaymentHistory
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('student'),
  getPaymentById
);
router.post('/webhook', paymentWebhook);

module.exports = router;
