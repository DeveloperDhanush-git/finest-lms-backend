const InstructorProfile = require("../models/instructor.model");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const createProfile = async (userId, profileData) => {
  const existingProfile = await InstructorProfile.findOne({
    userId,
  });

  if (existingProfile) {
    throw new Error("Instructor profile already exists");
  }

  const profile = await InstructorProfile.create({
    userId,
    ...profileData,
  });

  return profile;
};

const getProfile = async (userId) => {
  const profile = await InstructorProfile.ensureProfileForUser(userId);

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  return profile;
};

const updateProfile = async (userId, updateData) => {
  await InstructorProfile.ensureProfileForUser(userId);
  const profile = await InstructorProfile.findOneAndUpdate(
    { userId },
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!profile) {
    throw new Error("Instructor profile not found");
  }

  return profile;
};

const becomeInstructor = async (userId, profileData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "instructor") {
    throw new Error("User is already an instructor");
  }

  if (user.accountStatus !== "active") {
    throw new Error("Account is not active");
  }

  const profile = await createProfile(userId, profileData);

  user.role = "instructor";
  user.refreshTokenVersion += 1;
  await user.save();

  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, profile, accessToken, refreshToken };
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  becomeInstructor,
};
