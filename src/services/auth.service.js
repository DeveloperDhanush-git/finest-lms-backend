const crypto = require("crypto");
const { sendEmail } = require("./email.service");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} = require("../errors");

const { passwordHelper } = require("../helpers");

const registerUser = async (userData) => {
  const { email, password, firstName, lastName } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User already exists with this email key", "USER_EXISTS");
  }

  const passwordHash = await passwordHelper.hashPassword(password);

  const newUser = new User({ firstName, lastName, email, passwordHash });
  await newUser.save();

  return newUser;
};

const loginUser = async (email, password) => {
  const user = await User.findActiveUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await passwordHelper.comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const payload = { id: user._id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};

const refreshUserToken = async (refreshToken) => {
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid or expired refresh token", "INVALID_REFRESH_TOKEN");
  }

  const decoded = verifyRefreshToken(refreshToken);

  storedToken.isRevoked = true;
  await storedToken.save();

  const payload = { id: decoded.id, role: decoded.role };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: decoded.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (refreshToken) => {
  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken) {
    throw new BadRequestError("Invalid or missing refresh token", "INVALID_REFRESH_TOKEN");
  }

  storedToken.isRevoked = true;
  await storedToken.save();
};

const forgotPassword = async (email) => {
  const user = await User.findOne({
    email,
    accountStatus: "active",
  });
  if (!user) {
    return;
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/api/auth/reset-password/${resetToken}`;

  const html = `
    <h2>Reset Password</h2>
    <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
    <a href="${resetLink}">Reset Password</a>
  `;

  await sendEmail(user.email, "Reset Password", html);
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+passwordHash");

  if (!user) {
    throw new BadRequestError("Invalid or expired password reset token", "INVALID_RESET_TOKEN");
  }

  user.passwordHash = await passwordHelper.hashPassword(password);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};
