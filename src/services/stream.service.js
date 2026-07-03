const Enrollment = require("../models/enrollment.model");

const CourseLecture = require("../models/lecture.model");

const Course = require("../models/course.model");

const {
  generateSignedUrl,
} = require("./cloudfront.service");

const getLectureStream = async (
  lectureId,
  userId
) => {

  /*
  -----------------------------
  Lecture
  -----------------------------
  */

  const lecture =
    await CourseLecture.findById(
      lectureId
    );

  if (!lecture || lecture.isDeleted) {
    throw new Error(
      "Lecture not found"
    );
  }

  /*
  -----------------------------
  Course
  -----------------------------
  */

  const course =
    await Course.findOne({

      _id:
        lecture.courseId,

      isDeleted:
        false,

      status:
        "published",

    });

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  /*
  -----------------------------
  Enrollment
  -----------------------------
  */

  if (!lecture.isPreview) {

    const enrollment =
      await Enrollment.findOne({

        studentId:
          userId,

        courseId:
          course._id,

        status:
          "active",

      });

    if (!enrollment) {

      throw new Error(
        "You are not enrolled in this course."
      );

    }

  }

  /*
  -----------------------------
  Video Ready?
  -----------------------------
  */

  if (
    lecture.video.processingStatus === "failed"
  ) {
    throw new Error(
      lecture.video.processingError ||
      "Video processing failed."
    );
  }

  if (
    lecture.video.processingStatus !==
    "completed"
  ) {
    throw new Error(
      "Video is still processing."
    );
  }

  if (
    !lecture.video.masterPlaylist
  ) {

    throw new Error(
      "Master playlist not found."
    );

  }

  /*
  -----------------------------
  Response
  -----------------------------
  */

  return {

    lectureId:
      lecture._id,

    title:
      lecture.title,

    duration:
      lecture.duration,

    isPreview:
      lecture.isPreview,

    thumbnail:
      lecture.video.thumbnail,

    metadata:
      lecture.video.metadata,

    resolutions:
      lecture.video.resolutions,

    streamUrl:
      generateSignedUrl(
        lecture.video.masterPlaylist
      ),

  };

};

module.exports = {
  getLectureStream,
};