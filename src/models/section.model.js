const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: null,
    },

    order: {
      type: Number,
      required: true,
    },

    totalDuration: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

sectionSchema.index({
  courseId: 1,
});

sectionSchema.index({
  courseId: 1,
  order: 1,
});

module.exports = mongoose.model('CourseSection', sectionSchema);
