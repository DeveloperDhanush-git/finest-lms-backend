const { z } = require('zod');

const createReviewSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),

  rating: z
    .number({
      required_error: 'Rating is required',
    })
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),

  review: z
    .string()
    .trim()
    .min(1, 'Review is required')
    .max(2000, 'Review cannot exceed 2000 characters'),
});

const updateReviewSchema = z
  .object({
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional(),

    review: z
      .string()
      .trim()
      .min(1, 'Review cannot be empty')
      .max(2000, 'Review cannot exceed 2000 characters')
      .optional(),
  })
  .refine(
    (data) => data.rating !== undefined || data.review !== undefined,

    {
      message: 'At least one field is required',
    }
  );

module.exports = {
  createReviewSchema,

  updateReviewSchema,
};
