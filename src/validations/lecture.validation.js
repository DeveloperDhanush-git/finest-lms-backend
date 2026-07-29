const { z } = require('zod');

const createLectureSchema = z.object({
  courseId: z.string(),

  sectionId: z.string(),

  title: z.string().min(3).max(200),

  description: z.string().optional(),

  videoUrl: z.string().optional(),

  videoPublicId: z.string().optional(),

  duration: z.number().min(0),

  order: z.number().min(1),

  isPreview: z.boolean().optional(),
});

const updateLectureSchema = createLectureSchema.partial();

module.exports = {
  createLectureSchema,
  updateLectureSchema,
};
