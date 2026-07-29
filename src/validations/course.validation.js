const { z } = require('zod');

const createCourseSchema = z.object({
  categoryId: z.string(),

  title: z.string().min(5).max(200),

  subtitle: z.string().optional(),

  description: z.string().min(20),

  language: z.string().optional(),

  level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']),

  price: z.number().min(0).optional(),

  discountPrice: z.number().min(0).optional(),

  requirements: z.array(z.string()).optional(),

  learningObjectives: z.array(z.string()).optional(),

  targetAudience: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),

  thumbnail: z.string().optional(),

  thumbnailPublicId: z.string().optional(),

  previewVideo: z.string().optional(),

  previewVideoPublicId: z.string().optional(),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};
