const courseService = require('../services/course.service');
const publicCourseService = require('../services/publicCourse.service');
const fs = require('fs-extra');
const path = require('path');
const { randomUUID } = require('crypto');
const { uploadFileToS3 } = require('../services/s3.service');
const { asyncHandler, success, created } = require('../helpers');
const { BadRequestError } = require('../errors');

const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.user._id, req.body);
  return created(res, 'Course created successfully', course);
});

const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getMyCourses(req.user._id);
  return success(res, 'My courses retrieved successfully', courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id, req.user._id);
  return success(res, 'Course retrieved successfully', course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.user._id, req.body);
  return success(res, 'Course updated successfully', course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id, req.user._id);
  return success(res, 'Course deleted successfully');
});

const submitCourse = asyncHandler(async (req, res) => {
  const course = await courseService.submitCourse(req.params.id, req.user._id);
  return success(res, 'Course submitted for review successfully', course);
});

const unpublishCourse = asyncHandler(async (req, res) => {
  const course = await courseService.unpublishCourse(req.params.id, req.user._id);
  return success(res, 'Course unpublished successfully', course);
});

const uploadThumbnail = asyncHandler(async (req, res) => {
  try {
    // FIX: Check for file type rejection (set in Multer fileFilter)
    if (req.fileRejectionReason) {
      throw new BadRequestError(req.fileRejectionReason);
    }

    if (!req.file) {
      throw new BadRequestError('Please upload an image file');
    }

    const extension = path.extname(req.file.originalname);
    const key = `courses/thumbnails/${req.params.id}/${randomUUID()}${extension}`;

    const thumbnailUrl = await uploadFileToS3(req.file.path, key);

    const course = await courseService.updateThumbnail(
      req.params.id,
      req.user._id,
      thumbnailUrl,
      key
    );

    return success(res, 'Thumbnail updated successfully', {
      thumbnail: course.thumbnail,
      thumbnailKey: course.thumbnailKey,
    });
  } finally {
    if (req.file?.path) {
      await fs.remove(req.file.path);
    }
  }
});

const uploadPreviewVideo = asyncHandler(async (req, res) => {
  try {
    // FIX: Check for file type rejection (set in Multer fileFilter)
    if (req.fileRejectionReason) {
      throw new BadRequestError(req.fileRejectionReason);
    }

    if (!req.file) {
      throw new BadRequestError('Please upload a video file');
    }

    const extension = path.extname(req.file.originalname);
    const key = `courses/previews/${req.params.id}/${randomUUID()}${extension}`;

    const videoUrl = await uploadFileToS3(req.file.path, key);

    const course = await courseService.updatePreviewVideo(
      req.params.id,
      req.user._id,
      {
        url: videoUrl,
        key,
        duration: 0,
        size: req.file.size,
        mimeType: req.file.mimetype,
      }
    );

    return success(res, 'Preview video updated successfully', {
      previewVideo: course.previewVideo,
    });
  } finally {
    if (req.file?.path) {
      await fs.remove(req.file.path);
    }
  }
});

const removeThumbnail = asyncHandler(async (req, res) => {
  await courseService.deleteThumbnail(req.params.id, req.user._id);
  return success(res, 'Thumbnail removed successfully');
});

const removePreviewVideo = asyncHandler(async (req, res) => {
  await courseService.deletePreviewVideo(req.params.id, req.user._id);
  return success(res, 'Preview video removed successfully');
});

const getSearchSuggestions = asyncHandler(async (req, res) => {
  const suggestions = await publicCourseService.getSearchSuggestions(req.query.q || '');
  return success(res, 'Search suggestions retrieved successfully', suggestions);
});

module.exports = {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  submitCourse,
  unpublishCourse,
  uploadThumbnail,
  removeThumbnail,
  uploadPreviewVideo,
  removePreviewVideo,
  getSearchSuggestions,
};
