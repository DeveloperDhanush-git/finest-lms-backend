const { z } = require('zod');

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),

  lastName: z.string().max(50).optional(),

  phone: z.string().min(10).max(15).optional(),

  avatar: z.string().optional(),

  avatarPublicId: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').max(30),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
};
