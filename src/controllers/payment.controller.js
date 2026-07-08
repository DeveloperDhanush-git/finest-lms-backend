const paymentService = require('../services/payment.service');

const createCheckout = async (req, res, next) => {
  try {
    const { payment, razorpayOrder } = await paymentService.createCheckout(req.user._id);

    return res.status(200).json({
      success: true,

      message: 'Checkout created successfully.',

      data: {
        paymentId: payment._id,

        orderId: razorpayOrder.id,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(
      req.user._id,

      req.body
    );

    return res.status(200).json({
      success: true,

      message: 'Payment verified successfully.',

      data: {
        paymentId: payment._id,

        orderId: payment.razorpayOrderId,

        paymentIdRazorpay: payment.razorpayPaymentId,

        status: payment.status,

        paidAt: payment.paidAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentHistory(req.user._id);

    return res.status(200).json({
      success: true,

      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(
      req.params.id,

      req.user._id
    );

    return res.status(200).json({
      success: true,

      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const paymentWebhook = async (req, res, next) => {
  try {
    await paymentService.handleWebhook(
      req.headers,

      req.body
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckout,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
  paymentWebhook,
};
