const studentService =
  require("../services/student.service");

/*
----------------------------------------
GET /student/my-learning
----------------------------------------
*/

const getMyLearning =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getMyLearning(
          req.user._id
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
GET /student/course/:courseId
----------------------------------------
*/

const getCourse =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getCourse(
          req.user._id,
          req.params.courseId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
GET /student/course/:courseId/curriculum
----------------------------------------
*/

const getCourseCurriculum =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getCourseCurriculum(
          req.user._id,
          req.params.courseId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
GET /student/course/:courseId/lecture/:lectureId
----------------------------------------
*/

const getLecture =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getLecture(
          req.user._id,
          req.params.courseId,
          req.params.lectureId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
PATCH /student/course/:courseId/lecture/:lectureId/progress
----------------------------------------
*/

const updateProgress =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.updateProgress(
          req.user._id,
          req.params.courseId,
          req.params.lectureId
        );

      return res.status(200).json({
        success: true,
        message:
          "Progress updated successfully",
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
GET /student/course/:courseId/progress
----------------------------------------
*/

const getCourseProgress =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getCourseProgress(
          req.user._id,
          req.params.courseId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
GET /student/course/:courseId/resume
----------------------------------------
*/

const getResumeLecture =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.getResumeLecture(
          req.user._id,
          req.params.courseId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {

      next(error);

    }

  };

/*
----------------------------------------
POST /student/course/:courseId/complete
----------------------------------------
*/

const completeCourse =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await studentService.completeCourse(
          req.user._id,
          req.params.courseId
        );

      return res.status(200).json({
        success: true,
        message:
          "Course completed successfully",
        data,
      });

    } catch (error) {

      next(error);

    }

  };

module.exports = {
  getMyLearning,
  getCourse,
  getCourseCurriculum,
  getLecture,
  updateProgress,
  getCourseProgress,
  getResumeLecture,
  completeCourse,
};