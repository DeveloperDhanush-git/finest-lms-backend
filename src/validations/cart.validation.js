const { z } = require('zod');

const addToCartSchema = z.object({
  courseId: z.string().trim().min(1, 'Course ID is required'),
});

module.exports = {
  addToCartSchema,
};
