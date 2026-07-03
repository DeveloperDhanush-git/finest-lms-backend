const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstructorProfile",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    subtitle: {
      type: String,
      default: null,
    },

    description: {
  type: String,
  required: true,
},

thumbnail: {
  type: String,
  default: null,
},

thumbnailKey: {
  type: String,
  default: null,
},

previewVideo: {
  type: {
    url: {
      type: String,
      default: null,
    },
    key: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: null,
    },
  },
  default: null,
},
    language: {
      type: String,
      default: "English",
    },

    level: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced",
        "all_levels",
      ],
      default: "all_levels",
    },

    price: {
      type: Number,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    totalDuration: {
      type: Number,
      default: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalEnrollments: {
      type: Number,
      default: 0,
    },

    requirements: {
      type: [String],
      default: [],
    },

    learningObjectives: {
      type: [String],
      default: [],
    },

    targetAudience: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "published",
        "rejected",
        "archived",
      ],
      default: "draft",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(
  "Course",
  courseSchema
);