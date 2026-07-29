const reviewService = require('../services/review.service');
const { asyncHandler, success, created } = require('../helpers');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  return created(res, 'Review added successfully.', review);
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.user._id, req.body);
  return success(res, 'Review updated successfully.', review);
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user._id);
  return success(res, 'Review deleted successfully.');
});

const getCourseReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getCourseReviews(
    req.params.courseId,
    req.query.page,
    req.query.limit
  );
  return success(res, 'Course reviews retrieved successfully', reviews);
});

const getMyReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getMyReview(req.params.courseId, req.user._id);
  return success(res, 'My review retrieved successfully', review);
});

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getCourseReviews,
  getMyReview,
};
