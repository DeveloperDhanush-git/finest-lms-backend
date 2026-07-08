const userService = require('../services/user.service');

const fs = require('fs-extra');
const path = require('path');
const { randomUUID } = require('crypto');

const { uploadFileToS3 } = require('../services/s3.service');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserDetails(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
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
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserDetails(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
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
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserProfile = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,

        message: 'Please upload an image.',
      });
    }

    const extension = path.extname(req.file.originalname);

    const key = `profiles/${req.user._id}/${randomUUID()}${extension}`;

    const avatarUrl = await uploadFileToS3(
      req.file.path,

      key
    );

    const user = await userService.updateAvatar(
      req.user._id,

      avatarUrl,

      key
    );

    return res.status(200).json({
      success: true,

      message: 'Avatar updated successfully.',

      data: {
        avatar: user.avatar,

        avatarKey: user.avatarKey,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file?.path) {
      await fs.remove(req.file.path);
    }
  }
};

const removeAvatar = async (req, res, next) => {
  try {
    await userService.deleteAvatar(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Avatar removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. All sessions have been revoked.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
};
