const { z } = require('zod');

const createSectionSchema = z.object({
  title: z.string().min(3).max(200),

  description: z.string().optional(),

  order: z.number().min(1),
});

const updateSectionSchema = createSectionSchema.partial();

module.exports = {
  createSectionSchema,
  updateSectionSchema,
};
