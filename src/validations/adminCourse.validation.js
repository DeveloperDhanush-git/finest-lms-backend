const { z } = require('zod');

const rejectCourseSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be at most 500 characters'),
});

module.exports = {
  rejectCourseSchema,
};
