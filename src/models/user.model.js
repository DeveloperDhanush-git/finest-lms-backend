const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: null,
    },

    avatarKey: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
      trim: true,
    },

    countryCode: {
      type: String,
      default: "+91",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "blocked", "deleted"],
      default: "active",
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    refreshTokenVersion: {
      type: Number,
      default: 0,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

userSchema.index({ role: 1 });

userSchema.index({ accountStatus: 1 });

userSchema.index({ createdAt: -1 });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.statics.findActiveUserByEmail = function (email) {
  return this.findOne({
    email,
    accountStatus: "active",
  }).select("+passwordHash");
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.passwordHash;

  delete obj.refreshTokenVersion;

  delete obj.loginAttempts;

  delete obj.lockUntil;

  delete obj.resetPasswordToken;

  delete obj.resetPasswordExpires;

  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
