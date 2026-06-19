const courseService =
  require("../services/course.service");

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

module.exports = {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
};