const Review = require('../models/review.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const mongoose = require('mongoose');

const updateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
        isDeleted: false,
      },
    },

    {
      $group: {
        _id: '$courseId',

        averageRating: {
          $avg: '$rating',
        },

        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (stats.length === 0) {
    await Course.findByIdAndUpdate(
      courseId,

      {
        averageRating: 0,

        totalReviews: 0,
      }
    );

    return;
  }

  await Course.findByIdAndUpdate(
    courseId,

    {
      averageRating: Number(stats[0].averageRating.toFixed(1)),

      totalReviews: stats[0].totalReviews,
    }
  );
};

const createReview = async (userId, data) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,

    courseId: data.courseId,

    status: { $in: ['active', 'completed'] },
  });

  if (!enrollment) {
    throw new Error('You must purchase this course before reviewing it.');
  }

  const exists = await Review.findOne({
    studentId: userId,

    courseId: data.courseId,
  });

  let review;
  if (exists) {
    if (exists.isDeleted) {
      exists.isDeleted = false;
      exists.rating = data.rating;
      exists.review = data.review;
      review = await exists.save();
      await updateCourseRating(data.courseId);
    } else {
      throw new Error('You have already reviewed this course.');
    }
  } else {
    review = await Review.create({
      studentId: userId,

      courseId: data.courseId,

      rating: data.rating,

      review: data.review,
    });

    await updateCourseRating(data.courseId);
  }

  // Send Notification
  try {
    const { createNotification } = require('./notification.service');
    const courseWithInstructor = await Course.findById(data.courseId).populate('instructorId');
    if (courseWithInstructor && courseWithInstructor.instructorId && courseWithInstructor.instructorId.userId) {
      await createNotification({
        recipientId: courseWithInstructor.instructorId.userId,
        senderId: userId, // student user
        type: 'NEW_REVIEW',
        title: 'New Course Review',
        message: `A student has left a ${data.rating}-star review on your course "${courseWithInstructor.title}".`,
        data: { courseId: data.courseId, reviewId: review._id },
      });
    }
  } catch (err) {
    console.error('Failed to send NEW_REVIEW notification:', err.message);
  }

  return review;
};

const updateReview = async (reviewId, userId, data) => {
  const review = await Review.findOne({
    _id: reviewId,

    studentId: userId,

    isDeleted: false,
  });

  if (!review) {
    throw new Error('Review not found.');
  }

  if (data.rating !== undefined) {
    review.rating = data.rating;
  }

  if (data.review !== undefined) {
    review.review = data.review;
  }

  await review.save();

  await updateCourseRating(review.courseId);

  return review;
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOne({
    _id: reviewId,

    studentId: userId,

    isDeleted: false,
  });

  if (!review) {
    throw new Error('Review not found.');
  }

  review.isDeleted = true;

  await review.save();

  await updateCourseRating(review.courseId);

  return review;
};

const getCourseReviews = async (courseId, page = 1, limit = 10) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const stats = await Review.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
        isDeleted: false,
      },
    },

    {
      $group: {
        _id: '$rating',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const breakdown = {
    5: 0,

    4: 0,

    3: 0,

    2: 0,

    1: 0,
  };

  let totalReviews = 0;

  let totalRating = 0;

  for (const item of stats) {
    breakdown[item._id] = item.count;

    totalReviews += item.count;

    totalRating += item._id * item.count;
  }

  const averageRating = totalReviews === 0 ? 0 : Number((totalRating / totalReviews).toFixed(1));

  const reviews = await Review.find({
    courseId,

    isDeleted: false,
  })

    .populate(
      'studentId',

      'firstName lastName avatar'
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit);

  const total = await Review.countDocuments({
    courseId,

    isDeleted: false,
  });

  return {
    statistics: {
      averageRating,

      totalReviews,

      breakdown,
    },

    pagination: {
      currentPage: page,

      totalPages: Math.ceil(total / limit),

      totalReviews: total,

      pageSize: limit,
    },

    reviews,
  };
};

const getMyReview = async (courseId, userId) => {
  return await Review.findOne({
    courseId,

    studentId: userId,

    isDeleted: false,
  });
};

module.exports = {
  createReview,

  updateReview,

  deleteReview,

  getCourseReviews,

  getMyReview,
};
