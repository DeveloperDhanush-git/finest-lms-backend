const userService = require('../services/user.service');
const fs = require('fs-extra');
const path = require('path');
const { randomUUID } = require('crypto');
const { uploadFileToS3 } = require('../services/s3.service');
const { asyncHandler, success } = require('../helpers');
const { BadRequestError } = require('../errors');

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetails(req.user._id);

  return success(res, 'Profile fetched successfully', {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    countryCode: user.countryCode,
    accountStatus: user.accountStatus,
    createdAt: user.createdAt,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserDetails(req.user._id, req.body);

  return success(res, 'Profile updated successfully', {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    countryCode: user.countryCode,
    accountStatus: user.accountStatus,
  });
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.user._id);
  return success(res, 'Account deleted successfully');
});

const uploadAvatar = asyncHandler(async (req, res) => {
  try {
    // FIX: Check for file type rejection (set in Multer fileFilter)
    if (req.fileRejectionReason) {
      throw new BadRequestError(req.fileRejectionReason);
    }

    if (!req.file) {
      throw new BadRequestError('Please upload an image.');
    }

    const extension = path.extname(req.file.originalname);
    const key = `profiles/${req.user._id}/${randomUUID()}${extension}`;

    const avatarUrl = await uploadFileToS3(req.file.path, key);

    const user = await userService.updateAvatar(req.user._id, avatarUrl, key);

    return success(res, 'Avatar updated successfully.', {
      avatar: user.avatar,
      avatarKey: user.avatarKey,
    });
  } finally {
    if (req.file?.path) {
      await fs.remove(req.file.path);
    }
  }
});

const removeAvatar = asyncHandler(async (req, res) => {
  await userService.deleteAvatar(req.user._id);
  return success(res, 'Avatar removed successfully');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user._id, currentPassword, newPassword);
  return success(res, 'Password changed successfully. All sessions have been revoked.');
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
};
