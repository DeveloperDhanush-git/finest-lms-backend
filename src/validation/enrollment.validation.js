const { z } =
  require("zod");

const updateProgressSchema =
  z.object({
    courseId:
      z.string(),

    lectureId:
      z.string(),
  });

module.exports = {
  updateProgressSchema,
};