const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const Payment = require('../models/payment.model');
const Review = require('../models/review.model');
const Certificate = require('../models/certificate.model');
const InstructorProfile = require('../models/instructor.model');

const getDashboard = async () => {

  const [totalUsers, totalStudents, totalInstructors] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: 'student',
    }),

    User.countDocuments({
      role: 'instructor',
    }),
  ]);

  const [totalCourses, publishedCourses, pendingCourses, rejectedCourses, draftCourses] =
    await Promise.all([
      Course.countDocuments({
        isDeleted: false,
      }),

      Course.countDocuments({
        status: 'published',
        isDeleted: false,
      }),

      Course.countDocuments({
        status: 'pending',
        isDeleted: false,
      }),

      Course.countDocuments({
        status: 'rejected',
        isDeleted: false,
      }),

      Course.countDocuments({
        status: 'draft',
        isDeleted: false,
      }),
    ]);

  const totalEnrollments = await Enrollment.countDocuments({
    status: {
      $in: ['active', 'completed'],
    },
  });

  const revenueResult = await Payment.aggregate([
    {
      $match: {
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

  const totalReviews = await Review.countDocuments({
    isDeleted: false,
  });

  const totalCertificates = await Certificate.countDocuments();

  const recentUsers = await User.find()

    .select('firstName lastName email role avatar createdAt')

    .sort({
      createdAt: -1,
    })

    .limit(5);

  const recentEnrollments = await Enrollment.find()

    .populate('studentId', 'firstName lastName avatar')

    .populate('courseId', 'title thumbnail')

    .sort({
      createdAt: -1,
    })

    .limit(5);

  const recentPayments = await Payment.find({
    status: 'completed',
  })

    .populate('userId', 'firstName lastName')

    .populate('courseId', 'title')

    .sort({
      createdAt: -1,
    })

    .limit(5);

  const topCourses = await Course.find({
    status: 'published',
    isDeleted: false,
  })

    .select('title thumbnail totalEnrollments averageRating totalReviews')

    .sort({
      totalEnrollments: -1,
      averageRating: -1,
    })

    .limit(5);

  const topInstructors = await InstructorProfile.find()

    .populate('userId', 'firstName lastName avatar')

    .sort({
      totalStudents: -1,
      averageRating: -1,
    })

    .limit(5);

  const students = await User.find({ role: 'student' })
    .select('firstName lastName email avatar createdAt')
    .sort({ createdAt: -1 });

  const studentIds = students.map(s => s._id);
  const studentEnrollments = await Enrollment.find({ studentId: { $in: studentIds } });

  const studentDetails = students.map(s => {
    const enrollments = studentEnrollments.filter(e => e.studentId.toString() === s._id.toString());
    return {
      _id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      avatar: s.avatar,
      createdAt: s.createdAt,
      totalEnrollments: enrollments.length,
      completedCourses: enrollments.filter(e => e.status === 'completed').length,
    };
  });

  const instructors = await InstructorProfile.find()
    .populate('userId', 'firstName lastName email avatar createdAt')
    .sort({ createdAt: -1 });

  const instructorDetails = instructors.map(inst => {
    const u = inst.userId || {};
    return {
      _id: inst._id,
      userId: u._id,
      firstName: u.firstName || 'Teacher',
      lastName: u.lastName || '',
      email: u.email || '—',
      avatar: u.avatar || '',
      createdAt: u.createdAt || inst.createdAt,
      totalCourses: inst.totalCourses || 0,
      totalStudents: inst.totalStudents || 0,
      averageRating: inst.averageRating || 0,
      totalRevenue: inst.totalRevenue || 0,
    };
  });

  return {
    overview: {
      totalUsers,

      totalStudents,

      totalInstructors,

      totalCourses,

      publishedCourses,

      pendingCourses,

      rejectedCourses,

      draftCourses,

      totalEnrollments,

      totalRevenue,

      totalReviews,

      totalCertificates,
    },

    students: studentDetails,

    instructors: instructorDetails,

    recentUsers,

    recentEnrollments,

    recentPayments,

    topCourses,

    topInstructors,
  };
};

module.exports = {
  getDashboard,
};
