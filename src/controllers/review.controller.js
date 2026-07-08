const reviewService = require('../services/review.service');

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.body);

    return res.status(201).json({
      success: true,

      message: 'Review added successfully.',

      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.id,

      req.user._id,

      req.body
    );

    return res.status(200).json({
      success: true,

      message: 'Review updated successfully.',

      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(
      req.params.id,

      req.user._id
    );

    return res.status(200).json({
      success: true,

      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getCourseReviews(
      req.params.courseId,

      req.query.page,

      req.query.limit
    );

    return res.status(200).json({
      success: true,

      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReview = async (req, res, next) => {
  try {
    const review = await reviewService.getMyReview(
      req.params.courseId,

      req.user._id
    );

    return res.status(200).json({
      success: true,

      data: review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,

  updateReview,

  deleteReview,

  getCourseReviews,

  getMyReview,
};
