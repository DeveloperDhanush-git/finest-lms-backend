const fs = require('fs-extra');
const path = require('path');
const lectureService = require('../services/lecture.service');
const { addVideoJob } = require('../jobs/video.job');
const { uploadFileToS3 } = require('../services/s3.service');
const { asyncHandler, success, created } = require('../helpers');
const { BadRequestError, ConflictError } = require('../errors');

const createLecture = asyncHandler(async (req, res) => {
  const lecture = await lectureService.createLecture(req.user._id, req.body);
  return created(res, 'Lecture created successfully', lecture);
});

const getLecturesBySection = asyncHandler(async (req, res) => {
  const lectures = await lectureService.getLecturesBySection(req.params.sectionId, req.user._id);
  return success(res, 'Lectures retrieved successfully', lectures);
});

const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await lectureService.updateLecture(req.params.id, req.user._id, req.body);
  return success(res, 'Lecture updated successfully', lecture);
});

const deleteLecture = asyncHandler(async (req, res) => {
  await lectureService.deleteLecture(req.params.id, req.user._id);
  return success(res, 'Lecture deleted successfully');
});

const uploadLectureVideo = asyncHandler(async (req, res) => {
  try {
    // FIX: Check for file type rejection (set in Multer fileFilter)
    if (req.fileRejectionReason) {
      throw new BadRequestError(req.fileRejectionReason);
    }

    if (!req.file) {
      throw new BadRequestError('Please upload a video.');
    }

    const lecture = await lectureService.markLectureProcessing(
      req.params.id,
      req.user._id,
      req.file.path
    );

    await addVideoJob({
      lectureId: lecture._id,
      videoPath: req.file.path,
    });

    return res.status(202).json({
      success: true,
      message: 'Video uploaded successfully. Processing started.',
      data: {
        lectureId: lecture._id,
        processingStatus: 'processing',
      },
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.remove(req.file.path).catch(() => { });
    }

    if (error.message === 'Video is already processing.') {
      throw new ConflictError(error.message);
    }

    throw error;
  }
});

const uploadLectureResource = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new BadRequestError('Please upload a resource file');
    }
    const ext = path.extname(req.file.originalname);
    const key = `lectures/resources/${req.params.id}/${Date.now()}${ext}`;

    const url = await uploadFileToS3(req.file.path, key);

    const lecture = await lectureService.updateLectureResource(
      req.params.id,
      req.user._id,
      {
        title: path.parse(req.file.originalname).name,
        url,
        key,
        size: req.file.size,
        mimeType: req.file.mimetype,
      }
    );

    return success(res, 'Resource uploaded successfully', lecture);
  } finally {
    if (req.file?.path) {
      await fs.remove(req.file.path);
    }
  }
});

const removeLectureVideo = asyncHandler(async (req, res) => {
  await lectureService.removeLectureVideo(req.params.id, req.user._id);
  return success(res, 'Lecture video removed successfully.');
});

const removeLectureResource = asyncHandler(async (req, res) => {
  await lectureService.deleteLectureResource(req.params.id, req.user._id, req.params.resourceId);
  return success(res, 'Resource removed successfully');
});

const getLectureVideoStatus = asyncHandler(async (req, res) => {
  const status = await lectureService.getLectureVideoStatus(req.params.id, req.user._id);
  return success(res, 'Lecture video status retrieved successfully', status);
});

const reorderLectures = asyncHandler(async (req, res) => {
  const lectures = await lectureService.reorderLectures(req.params.sectionId, req.user._id, req.body.orderedIds);
  return success(res, 'Lectures reordered successfully', lectures);
});

module.exports = {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,
  uploadLectureVideo,
  removeLectureVideo,
  uploadLectureResource,
  removeLectureResource,
  getLectureVideoStatus,
  reorderLectures,
};
