const cartService = require('../services/cart.service');
const { asyncHandler, success } = require('../helpers');

const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user._id, req.body.courseId);
  return success(res, 'Course added to cart successfully.', cart);
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return success(res, 'Cart retrieved successfully', cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.courseId);
  return success(res, 'Course removed from cart successfully.', cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  return success(res, 'Cart cleared successfully.');
});

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
