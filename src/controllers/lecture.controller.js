const lectureService = require(
  "../services/lecture.service"
);

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
          req.params.sectionId
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

module.exports = {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,
};