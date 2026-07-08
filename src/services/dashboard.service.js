const Enrollment = require('../models/enrollment.model');

const Certificate = require('../models/certificate.model');

const Review = require('../models/review.model');

const Course = require('../models/course.model');

const getStatistics = async (userId) => {
  const enrolledCourses = await Enrollment.countDocuments({
    studentId: userId,
    status: { $in: ['active', 'completed'] },
  });

  const completedCourses = await Enrollment.countDocuments({
    studentId: userId,
    status: 'completed',
  });

  const inProgressCourses = await Enrollment.countDocuments({
    studentId: userId,
    status: 'active',
  });

  const certificates = await Certificate.countDocuments({
    studentId: userId,
    isRevoked: false,
  });

  const enrollments = await Enrollment.find({
    studentId: userId,
  }).select('courseId');

  const courseIds = enrollments.map((item) => item.courseId);

  const courses = await Course.find({
    _id: {
      $in: courseIds,
    },
  }).select('totalDuration');

  const learningHours = Number(
    (courses.reduce((sum, course) => sum + (course.totalDuration || 0), 0) / 60).toFixed(1)
  );

  return {
    enrolledCourses,

    completedCourses,

    inProgressCourses,

    certificates,

    learningHours,
  };
};

const getContinueLearning = async (userId) => {
  return await Enrollment.find({
    studentId: userId,

    status: 'active',
  })

    .populate({
      path: 'courseId',

      select: 'title thumbnail totalDuration',
    })

    .sort({
      updatedAt: -1,
    })

    .limit(5);
};

const getRecentCertificates = async (userId) => {
  return await Certificate.find({
    studentId: userId,

    isRevoked: false,
  })

    .populate({
      path: 'courseId',

      select: 'title thumbnail',
    })

    .sort({
      issuedAt: -1,
    })

    .limit(5);
};

const getRecentReviews = async (userId) => {
  return await Review.find({
    studentId: userId,

    isDeleted: false,
  })

    .populate({
      path: 'courseId',

      select: 'title thumbnail',
    })

    .sort({
      createdAt: -1,
    })

    .limit(5);
};

const getStudentDashboard = async (userId) => {
  const [statistics, continueLearning, recentCertificates, recentReviews] = await Promise.all([
    getStatistics(userId),

    getContinueLearning(userId),

    getRecentCertificates(userId),

    getRecentReviews(userId),
  ]);

  return {
    statistics,

    continueLearning,

    recentCertificates,

    recentReviews,
  };
};

module.exports = {
  getStudentDashboard,
};
