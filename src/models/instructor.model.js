const mongoose = require("mongoose");

const instructorProfileSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      headline: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      biography: {
        type: String,
        required: true,
        maxlength: 5000,
      },

      website: {
        type: String,
        default: null,
      },

      linkedin: {
        type: String,
        default: null,
      },

      twitter: {
        type: String,
        default: null,
      },

      youtube: {
        type: String,
        default: null,
      },

      expertise: {
        type: [String],
        default: [],
      },

      totalCourses: {
        type: Number,
        default: 0,
      },

      totalStudents: {
        type: Number,
        default: 0,
      },

      averageRating: {
        type: Number,
        default: 0,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

module.exports = mongoose.model(
  "InstructorProfile",
  instructorProfileSchema
);