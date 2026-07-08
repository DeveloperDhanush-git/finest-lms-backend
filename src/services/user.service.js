const User = require('../models/user.model');
const refreshToken = require('../models/refreshToken.model');
const bcrypt = require('bcryptjs');

const getUserDetails = async (userId) => {
  const user = await User.findById(userId).select(
    'firstName lastName email role avatar avatarKey phone countryCode accountStatus createdAt'
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
const updateUserDetails = async (userId, updateData) => {
  const allowedUpdates = {};
  if (updateData.firstName !== undefined) {
    allowedUpdates.firstName = updateData.firstName;
  }

  if (updateData.lastName !== undefined) {
    allowedUpdates.lastName = updateData.lastName;
  }

  if (updateData.phone !== undefined) {
    allowedUpdates.phone = updateData.phone;
  }

  if (updateData.avatar !== undefined) {
    allowedUpdates.avatar = updateData.avatar;
  }
  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    returnDocument: 'after',
    runValidators: true,
    projection:
      'firstName lastName email role avatar avatarKey phone countryCode accountStatus createdAt',
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      accountStatus: 'deleted',
      deletedAt: new Date(),
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );
  if (!user) {
    throw new Error('User Not Found');
  }

  await refreshToken.updateMany({ userId }, { isRevoked: true });
  return user;
};

const { deleteFileFromS3 } = require('./s3.service');

const updateAvatar = async (userId, avatarUrl, avatarKey) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.avatarKey) {
    await deleteFileFromS3(user.avatarKey);
  }

  user.avatar = avatarUrl;

  user.avatarKey = avatarKey;

  await user.save();

  return user;
};

const deleteAvatar = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.avatarKey) {
    await deleteFileFromS3(user.avatarKey);
  }

  user.avatar = null;

  user.avatarKey = null;

  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid current password');
  }

  const saltRounds = 12;
  user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
  await user.save();

  await refreshToken.updateMany({ userId }, { isRevoked: true });

  return true;
};

module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  updateAvatar,
  deleteAvatar,
  changePassword,
};
