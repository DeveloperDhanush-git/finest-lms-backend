const { z } = require("zod");

const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name must be at least 1 characters")
    .max(50),
  lastName: z
    .string()
    .max(50)
    .optional(),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password maximum length must be 30 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
