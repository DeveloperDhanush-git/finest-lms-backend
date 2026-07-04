const courseService =
  require("../services/course.service");

const publicCourseService = require("../services/publicCourse.service")

const fs = require("fs-extra");
const path = require("path");
const { randomUUID } = require("crypto");

const {
  uploadFileToS3,
} = require("../services/s3.service");

const createCourse = async (
  req,
  res,
  next
) => {
  try {
    const course =
      await courseService.createCourse(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (
  req,
  res,
  next
) => {
  try {
    const courses =
      await courseService.getMyCourses(
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (
  req,
  res,
  next
) => {
  try {
    const course =
      await courseService.getCourseById(
        req.params.id,
        req.user._id
      );

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (
  req,
  res,
  next
) => {
  try {
    const course =
      await courseService.updateCourse(
        req.params.id,
        req.user._id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (
  req,
  res,
  next
) => {
  try {
    await courseService.deleteCourse(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const publishCourse =
  async (
    req,
    res,
    next
  ) => {

    try {

      const course =
        await courseService.publishCourse(
          req.params.id,
          req.user._id
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Course published successfully",
          data: course,
        });

    } catch (error) {
      next(error);
    }
  };

const unpublishCourse =
  async (
    req,
    res,
    next
  ) => {

    try {

      const course =
        await courseService.unpublishCourse(
          req.params.id,
          req.user._id
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Course unpublished successfully",
          data: course,
        });

    } catch (error) {
      next(error);
    }
  };

const uploadThumbnail = async (
  req,
  res,
  next
) => {

  try {

    if (!req.file) {

      throw new Error(
        "Please upload an image file"
      );

    }

    const extension =
      path.extname(
        req.file.originalname
      );

    const key =
      `courses/thumbnails/${req.params.id}/${randomUUID()}${extension}`;

    const thumbnailUrl =
      await uploadFileToS3(

        req.file.path,

        key

      );

    const course =
      await courseService.updateThumbnail(

        req.params.id,

        req.user._id,

        thumbnailUrl,

        key

      );

    return res.status(200).json({

      success: true,

      message:
        "Thumbnail updated successfully",

      data: {

        thumbnail:
          course.thumbnail,

        thumbnailKey:
          course.thumbnailKey,

      },

    });

  }

  catch (error) {

    next(error);

  }

  finally {

    if (req.file?.path) {

      await fs.remove(
        req.file.path
      );

    }

  }

};

const uploadPreviewVideo = async (
  req,
  res,
  next
) => {

  try {

    if (!req.file) {

      throw new Error(
        "Please upload a video file"
      );

    }

    const extension =
      path.extname(
        req.file.originalname
      );

    const key =
      `courses/previews/${req.params.id}/${randomUUID()}${extension}`;

    const videoUrl =
      await uploadFileToS3(
        req.file.path,
        key
      );

    const course =
      await courseService.updatePreviewVideo(

        req.params.id,

        req.user._id,

        {
          url: videoUrl,
          key,

          duration: 0,

          size:
            req.file.size,

          mimeType:
            req.file.mimetype,
        }

      );

    return res
      .status(200)
      .json({

        success: true,

        message:
          "Preview video updated successfully",

        data: {

          previewVideo:
            course.previewVideo,

        },

      });

  }

  catch (error) {

    next(error);

  }

  finally {

    if (req.file?.path) {

      await fs.remove(
        req.file.path
      );

    }

  }

};

const removeThumbnail = async (req, res, next) => {
  try {
    await courseService.deleteThumbnail(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: "Thumbnail removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const removePreviewVideo = async (
  req,
  res,
  next
) => {

  try {

    await courseService.deletePreviewVideo(
      req.params.id,
      req.user._id
    );

    return res.status(200).json({

      success: true,

      message:
        "Preview video removed successfully",

    });

  }

  catch (error) {

    next(error);

  }

};

const getSearchSuggestions = async (
  req,
  res,
  next
) => {
  try {

    const suggestions =
      await publicCourseService.getSearchSuggestions(
        req.query.q || ""
      );

    return res.status(200).json({
      success: true,
      data: suggestions,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  uploadThumbnail,
  removeThumbnail,
  uploadPreviewVideo,
  removePreviewVideo,
  getSearchSuggestions,
};