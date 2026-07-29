const authService = require("../services/auth.service");
const { asyncHandler, success, created } = require("../helpers");

const register = asyncHandler(async (req, res) => {
  const newUser = await authService.registerUser(req.body);
  return created(res, "User registered successfully", { user: newUser });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  return success(res, "Login successful", {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshUserToken(token);

  return success(res, "Token refreshed successfully", {
    accessToken,
    refreshToken: newRefreshToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  await authService.logoutUser(token);

  return success(res, "Logout successful");
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return success(res, "If the email exists, a password reset link has been sent.");
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return success(res, "Password reset successful");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return success(res, "Current user retrieved successfully", { user: req.user });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
