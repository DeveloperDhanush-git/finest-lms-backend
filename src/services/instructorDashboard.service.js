const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const InstructorProfile = require('../models/instructor.model');
const Review = require('../models/review.model');
const Payment = require('../models/payment.model');

const getDashboard = async (userId) => {

  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const courses = await Course.find({
    instructorId: instructor._id,
    isDeleted: false,
  }).select('_id status averageRating totalReviews totalEnrollments');

  const courseIds = courses.map((course) => course._id);

  const totalCourses = courses.length;

  const publishedCourses = courses.filter((course) => course.status === 'published').length;

  const draftCourses = courses.filter((course) => course.status === 'draft').length;

  const pendingCourses = courses.filter((course) => course.status === 'pending').length;

  const rejectedCourses = courses.filter((course) => course.status === 'rejected').length;

  const totalStudents = await Enrollment.countDocuments({
    courseId: {
      $in: courseIds,
    },
    status: {
      $in: ['active', 'completed'],
    },
  });

  const revenueResult = await Payment.aggregate([
    {
      $match: {
        courseId: {
          $in: courseIds,
        },
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: '$amount',
        },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const ratingResult = await Review.aggregate([
    {
      $match: {
        courseId: {
          $in: courseIds,
        },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating',
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  const averageRating = Number((ratingResult[0]?.averageRating || 0).toFixed(1));

  const totalReviews = ratingResult[0]?.totalReviews || 0;

  const recentEnrollments = await Enrollment.find({
    courseId: {
      $in: courseIds,
    },
  })
    .populate('studentId', 'firstName lastName avatar')
    .populate('courseId', 'title thumbnail')
    .sort({
      createdAt: -1,
    })
    .limit(10);

  const topCourses = await Course.find({
    _id: {
      $in: courseIds,
    },
  })
    .select('title thumbnail totalEnrollments averageRating totalReviews')
    .sort({
      totalEnrollments: -1,
      averageRating: -1,
    })
    .limit(5);

  return {
    overview: {
      totalCourses,
      publishedCourses,
      draftCourses,
      pendingCourses,
      rejectedCourses,
      totalStudents,
      totalRevenue,
      averageRating,
      totalReviews,
    },
    recentEnrollments,
    topCourses,
  };
};

module.exports = {
  getDashboard,
};
