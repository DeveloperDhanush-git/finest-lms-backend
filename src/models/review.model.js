const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
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

reviewSchema.index(
  {
    studentId: 1,
    courseId: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.index({
  courseId: 1,
  createdAt: -1,
});

module.exports = mongoose.model('Review', reviewSchema);
