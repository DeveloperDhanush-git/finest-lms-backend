const paymentService = require('../services/payment.service');
const { asyncHandler, success } = require('../helpers');

const createCheckout = asyncHandler(async (req, res) => {
  const { payment, razorpayOrder } = await paymentService.createCheckout(req.user._id);

  return success(res, 'Checkout created successfully.', {
    paymentId: payment._id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.user._id, req.body);

  return success(res, 'Payment verified successfully.', {
    paymentId: payment._id,
    orderId: payment.razorpayOrderId,
    paymentIdRazorpay: payment.razorpayPaymentId,
    status: payment.status,
    paidAt: payment.paidAt,
  });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await paymentService.getPaymentHistory(req.user._id);
  return success(res, 'Payment history retrieved successfully', payments);
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id, req.user._id);
  return success(res, 'Payment details retrieved successfully', payment);
});

const paymentWebhook = asyncHandler(async (req, res) => {
  await paymentService.handleWebhook(req.headers, req.body);
  return success(res, 'Webhook handled successfully');
});

module.exports = {
  createCheckout,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  paymentWebhook,
};
