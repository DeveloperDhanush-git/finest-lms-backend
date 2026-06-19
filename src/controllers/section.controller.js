const sectionService =
  require("../services/section.service");

const createSection =
  async (
    req,
    res,
    next
  ) => {
    try {

      const section =
        await sectionService.createSection(
          req.user._id,
          req.params.courseId,
          req.body
        );

      res.status(201).json({
        success: true,
        data: section,
      });

    } catch (error) {
      next(error);
    }
  };

const getSections =
  async (
    req,
    res,
    next
  ) => {
    try {

      const sections =
        await sectionService.getSections(
          req.params.courseId
        );

      res.status(200).json({
        success: true,
        data: sections,
      });

    } catch (error) {
      next(error);
    }
  };

const updateSection =
  async (
    req,
    res,
    next
  ) => {
    try {

      const section =
        await sectionService.updateSection(
          req.params.id,
          req.user._id,
          req.body
        );

      res.status(200).json({
        success: true,
        data: section,
      });

    } catch (error) {
      next(error);
    }
  };

const deleteSection =
  async (
    req,
    res,
    next
  ) => {
    try {

      await sectionService.deleteSection(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message:
          "Section deleted successfully",
      });

    } catch (error) {
      next(error);
    }
  };

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
};