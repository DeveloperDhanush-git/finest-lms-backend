const streamService = require('../services/stream.service');
const { asyncHandler, success } = require('../helpers');

const getLectureStream = asyncHandler(async (req, res) => {
  const stream = await streamService.getLectureStream(req.params.lectureId, req.user._id);
  return success(res, 'Lecture stream retrieved successfully', stream);
});

module.exports = {
  getLectureStream,
};
