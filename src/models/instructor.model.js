const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

instructorProfileSchema.statics.ensureProfileForUser = async function (userId) {
  let profile = await this.findOne({ userId });
  if (!profile) {
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    if (user && user.role === 'admin') {
      profile = await this.create({
        userId,
        headline: 'Administrator',
        biography: 'System Administrator account.',
        expertise: ['Administration'],
      });
    }
  }
  return profile;
};

module.exports = mongoose.model('InstructorProfile', instructorProfileSchema);
