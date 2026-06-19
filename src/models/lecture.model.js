const mongoose = require("mongoose");

const lectureSchema =
  new mongoose.Schema(
    {
      courseId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },

      sectionId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref:
          "CourseSection",
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: null,
      },

      videoUrl: {
        type: String,
        default: null,
      },

      duration: {
        type: Number,
        default: 0,
      },

      order: {
        type: Number,
        required: true,
      },

      isPreview: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },

      resources: [
        {
          title: String,
          url: String,
        },
      ],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

module.exports =
  mongoose.model(
    "CourseLecture",
    lectureSchema
  );