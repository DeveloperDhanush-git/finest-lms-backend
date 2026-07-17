const Cart = require('../models/cart.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const InstructorProfile = require('../models/instructor.model');

const addToCart = async (userId, courseId) => {

  const course = await Course.findOne({
    _id: courseId,

    isDeleted: false,

    status: 'published',
  });

  if (!course) {
    throw new Error('Course not found.');
  }

  const instructor = await InstructorProfile.findOne({
    userId,
  });

  if (instructor && course.instructorId.toString() === instructor._id.toString()) {
    throw new Error('You cannot purchase your own course.');
  }

  const enrollment = await Enrollment.findOne({
    studentId: userId,

    courseId,

    status: { $in: ['active', 'completed'] },
  });

  if (enrollment) {
    throw new Error('You are already enrolled in this course.');
  }

  let cart = await Cart.findOne({
    studentId: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      studentId: userId,

      items: [],
    });
  }

  const exists = cart.items.some((item) => item.courseId.toString() === courseId.toString());

  if (exists) {
    throw new Error('Course already exists in cart.');
  }

  cart.items.push({
    courseId,

    price: course.price,
  });

  cart.totalItems = cart.items.length;

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price,

    0
  );

  await cart.save();

  return getCart(userId);
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({
    studentId: userId,
  }).populate({
    path: 'items.courseId',

    populate: {
      path: 'instructorId',
    },
  });

  if (!cart) {
    return {
      items: [],

      totalItems: 0,

      totalAmount: 0,
    };
  }

  return cart;
};

const removeFromCart = async (userId, courseId) => {
  const cart = await Cart.findOne({
    studentId: userId,
  });

  if (!cart) {
    throw new Error('Cart not found.');
  }

  cart.items = cart.items.filter((item) => item.courseId.toString() !== courseId.toString());

  cart.totalItems = cart.items.length;

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price,

    0
  );

  await cart.save();

  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({
    studentId: userId,
  });

  if (!cart) {
    return;
  }

  cart.items = [];

  cart.totalItems = 0;

  cart.totalAmount = 0;

  await cart.save();
};

module.exports = {
  addToCart,

  getCart,

  removeFromCart,

  clearCart,
};
