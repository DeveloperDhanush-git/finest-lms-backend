const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseSection',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
    },

    video: {
      original: {
        type: String,
        default: null,
      },

      masterPlaylist: {
        type: String,
        default: null,
      },

      s3Prefix: {
        type: String,
        default: null,
      },

      thumbnail: {
        type: String,
        default: null,
      },

      processingStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },

      processingError: {
        type: String,
        default: null,
      },

      resolutions: [
        {
          quality: {
            type: String,
          },

          playlist: {
            type: String,
          },
        },
      ],

      metadata: {
        width: Number,
        height: Number,
        duration: Number,
        bitrate: Number,
        codec: String,
        fps: Number,
      },
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
        title: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },

        key: {
          type: String,
          required: true,
        },

        size: Number,

        mimeType: String,

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('CourseLecture', lectureSchema);
