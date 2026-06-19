const publicCourseService =
  require(
    "../services/publicCourse.service"
  );

const getCourses =
  async (
    req,
    res,
    next
  ) => {
    try {

      const data =
        await publicCourseService.getPublicCourses(
          req.query
        );

      res.status(200).json({
        success: true,
        ...data,
      });

    } catch (error) {
      next(error);
    }
  };

const getCourseById =
  async (
    req,
    res,
    next
  ) => {

    try {

      const course =
        await publicCourseService.getPublicCourseById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: course,
      });

    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getCourses,
  getCourseById,
};