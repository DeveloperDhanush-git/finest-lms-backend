const fs = require("fs-extra");

const lectureService = require(
  "../services/lecture.service"
);
const path = require("path");

const {
  addVideoJob,
} = require("../jobs/video.job");

const {
  uploadFileToS3,
} = require("../services/s3.service");

const createLecture = async (
  req,
  res,
  next
) => {
  try {
    const lecture =
      await lectureService.createLecture(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

const getLecturesBySection =
  async (
    req,
    res,
    next
  ) => {
    try {
      const lectures =
        await lectureService.getLecturesBySection(
          req.params.sectionId,
          req.user._id
        );

      res.status(200).json({
        success: true,
        data: lectures,
      });
    } catch (error) {
      next(error);
    }
  };

const updateLecture = async (
  req,
  res,
  next
) => {
  try {
    const lecture =
      await lectureService.updateLecture(
        req.params.id,
        req.user._id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLecture = async (
  req,
  res,
  next
) => {
  try {
    await lectureService.deleteLecture(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Lecture deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const uploadLectureVideo =
  async (req, res, next) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload a video.",

        });

      }

      const lecture =
        await lectureService.markLectureProcessing(

          req.params.id,

          req.user._id,

          req.file.path

        );

      await addVideoJob({

        lectureId:
          lecture._id,

        videoPath:
          req.file.path,

      });

      return res.status(202).json({

        success: true,

        message:
          "Video uploaded successfully. Processing started.",

        data: {

          lectureId:
            lecture._id,

          processingStatus:
            "processing",

        },

      });

    }

    catch (error) {

      if (req.file?.path) {

        await fs.remove(
          req.file.path
        ).catch(() => { });

      }

      if (
        error.message ===
        "Video is already processing."
      ) {

        return res.status(409).json({

          success: false,

          message:
            error.message,

        });

      }

      next(error);

    }

  };

const uploadLectureResource =
  async (
    req,
    res,
    next
  ) => {

    try {

      if (!req.file) {
        throw new Error(
          "Please upload a resource file"
        );
      }
      const ext = path.extname(req.file.originalname);


      const key =
        `lectures/resources/${req.params.id}/${Date.now()}${ext}`;

      const url =
        await uploadFileToS3(
          req.file.path,
          key
        );

      const lecture =
        await lectureService.updateLectureResource(

          req.params.id,

          req.user._id,

          {

            title:
              path.parse(req.file.originalname).name,

            url,

            key,

            size:
              req.file.size,

            mimeType:
              req.file.mimetype,

          }

        );

      return res.status(200).json({

        success: true,

        message:
          "Resource uploaded successfully",

        data: lecture,

      });

    }

    catch (error) {

      next(error);

    }
    finally {

      if (req.file?.path) {

        await fs.remove(req.file.path);

      }

    }

  };

const removeLectureVideo =
  async (
    req,
    res,
    next
  ) => {

    try {

      await lectureService.removeLectureVideo(

        req.params.id,

        req.user._id

      );

      return res.status(200).json({

        success: true,

        message:
          "Lecture video removed successfully.",

      });

    }

    catch (error) {

      next(error);

    }

  };

const removeLectureResource = async (req, res, next) => {
  try {
    await lectureService.deleteLectureResource(
      req.params.id,
      req.user._id,
      req.params.resourceId
    );
    res.status(200).json({
      success: true,
      message: "Resource removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getLectureVideoStatus =
  async (
    req,
    res,
    next
  ) => {

    try {

      const status =
        await lectureService.getLectureVideoStatus(

          req.params.id,

          req.user._id

        );

      return res.status(200).json({

        success: true,

        data: status,

      });

    }

    catch (error) {

      next(error);

    }

  };

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
};