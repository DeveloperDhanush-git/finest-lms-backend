const streamService =
  require("../services/stream.service");

const getLectureStream =
  async (
    req,
    res,
    next
  ) => {

    try {

      const stream =
        await streamService.getLectureStream(
          req.params.lectureId,
          req.user._id
        );

      return res.status(200).json({
        success: true,
        data: stream,
      });

    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getLectureStream,
};