const Course = require('../models/course.model');
const CourseSection = require('../models/section.model');
const CourseLecture = require('../models/lecture.model');
const Enrollment = require('../models/enrollment.model');

const getPendingCourses = async () => {
  const courses = await Course.find({
    status: 'pending',
    isDeleted: false,
  })
    .populate('categoryId', 'name slug')
    .populate({
      path: 'instructorId',
      select: 'headline averageRating totalStudents',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar',
      },
    })
    .sort({
      createdAt: -1,
    });

  return await Promise.all(
    courses.map(async (course) => {
      const studentCount = await Enrollment.countDocuments({
        courseId: course._id,
        status: {
          $ne: 'cancelled',
        },
      });

      return {
        ...course.toObject(),
        studentCount,
      };
    })
  );
};

const getAdminCourseById = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  })
    .populate('categoryId', 'name slug')
    .populate({
      path: 'instructorId',
      select: 'headline averageRating totalStudents',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar email phone',
      },
    });

  if (!course) {
    throw new Error('Course not found');
  }

  const sections = await CourseSection.find({
    courseId,
    isDeleted: false,
  }).sort({
    order: 1,
  });

  const lectures = await CourseLecture.find({
    courseId,
    isDeleted: false,
  }).sort({
    sectionId: 1,
    order: 1,
  });

  const studentCount = await Enrollment.countDocuments({
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  return {
    course,
    sections,
    lectures,
    studentCount,
  };
};

const approveCourse = async (courseId, userId) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  }).populate({
    path: 'instructorId',
    select: 'userId',
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.status !== 'pending') {
    throw new Error('Course is not pending approval');
  }

  course.status = 'published';
  course.publishedAt = new Date();
  course.approvedBy = userId;
  course.approvedAt = new Date();
  course.rejectedBy = null;
  course.rejectedAt = null;
  course.rejectionReason = null;

  await course.save();

  // Set all sections of the course to isPublished: true
  await CourseSection.updateMany(
    { courseId: course._id, isDeleted: false },
    { $set: { isPublished: true } }
  );

  // Send Notification
  try {
    const { createNotification } = require('./notification.service');
    if (course.instructorId && course.instructorId.userId) {
      await createNotification({
        recipientId: course.instructorId.userId,
        senderId: userId,
        type: 'COURSE_APPROVED',
        title: 'Course Approved',
        message: `Your course "${course.title}" has been approved and published!`,
        data: { courseId: course._id },
      });
    }
  } catch (err) {
    console.error('Failed to send COURSE_APPROVED notification:', err.message);
  }

  return course;
};

const rejectCourse = async (courseId, userId, reason) => {
  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  }).populate({
    path: 'instructorId',
    select: 'userId',
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.status !== 'pending') {
    throw new Error('Course is not pending approval');
  }

  course.status = 'rejected';
  course.rejectedBy = userId;
  course.rejectedAt = new Date();
  course.rejectionReason = reason;
  course.approvedBy = null;
  course.approvedAt = null;
  course.publishedAt = null;

  await course.save();

  // Send Notification
  try {
    const { createNotification } = require('./notification.service');
    if (course.instructorId && course.instructorId.userId) {
      await createNotification({
        recipientId: course.instructorId.userId,
        senderId: userId,
        type: 'COURSE_REJECTED',
        title: 'Course Rejected',
        message: `Your course "${course.title}" was not approved. Reason: ${reason}`,
        data: { courseId: course._id, reason },
      });
    }
  } catch (err) {
    console.error('Failed to send COURSE_REJECTED notification:', err.message);
  }

  return course;
};

module.exports = {
  getPendingCourses,
  getAdminCourseById,
  approveCourse,
  rejectCourse,
};
