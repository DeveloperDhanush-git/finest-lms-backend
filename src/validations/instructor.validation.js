const { z } = require('zod');

const createInstructorSchema = z.object({
  headline: z.string().min(5).max(120),

  biography: z.string().min(20),

  website: z.string().url().optional(),

  linkedin: z.string().url().optional(),

  twitter: z.string().url().optional(),

  youtube: z.string().url().optional(),

  expertise: z.array(z.string()).optional(),
});

const updateInstructorSchema = createInstructorSchema.partial();

module.exports = {
  createInstructorSchema,
  updateInstructorSchema,
};
