const crypto = require("crypto");
const { sendEmail } = require("./email.service");
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');

const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const registerUser = async (userData) => {
  const { email, password, firstName, lastName } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({ firstName, lastName, email, passwordHash });
  await newUser.save();

  return newUser;
};

const loginUser = async (email, password) => {
  const user = await User.findActiveUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload = { id: user._id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Persist refresh token in DB (expires in 7 days)
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
    expiresAt: { $gt: new Date() }
  });

  if (!storedToken) {
    throw new Error('Invalid or expired refresh token');
  }

  const decoded = verifyRefreshToken(refreshToken);

  // Refresh Token Rotation: Revoke current token
  storedToken.isRevoked = true;
  await storedToken.save();

  const payload = { id: decoded.id, role: decoded.role };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  // Persist new refresh token
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
    throw new Error('Invalid refresh token');
  }

  storedToken.isRevoked = true;
  await storedToken.save();
};

const forgotPassword = async (email) => {
  const user =
    await User.findOne({
      email,
      accountStatus: "active",
    });
  if (!user) {
    return;
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token and save to DB
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`;

  const html = `
    <h2>Reset Password</h2>
    <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
    <a href="${resetLink}">Reset Password</a>
  `;

  await sendEmail(
    user.email,
    "Reset Password",
    html
  );
};

const resetPassword = async (token, password) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+passwordHash");

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  await RefreshToken.updateMany(
    { userId: user._id },
    { isRevoked: true }
  );
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};