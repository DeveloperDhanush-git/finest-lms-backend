const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const CourseSection = require('../models/section.model');
const CourseLecture = require('../models/lecture.model');

const getMyLearning = async (userId) => {
  const enrollments = await Enrollment.find({
    studentId: userId,
    status: {
      $ne: 'cancelled',
    },
  })
    .populate({
      path: 'courseId',
      populate: [
        {
          path: 'categoryId',
          select: 'name slug',
        },
        {
          path: 'instructorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName avatar',
          },
        },
      ],
    })
    .populate('lastAccessedLecture', 'title duration sectionId')
    .sort({
      updatedAt: -1,
    });

  return enrollments.map((enrollment) => ({
    enrollmentId: enrollment._id,

    enrolledAt: enrollment.enrolledAt,

    status: enrollment.status,

    progressPercentage: enrollment.progressPercentage,

    completedLectures: enrollment.completedLectures.length,

    completedAt: enrollment.completedAt,

    lastAccessedLecture: enrollment.lastAccessedLecture,

    course: enrollment.courseId,
  }));
};

const getCourse = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  const course = await Course.findOne({
    _id: courseId,
    status: 'published',
    isDeleted: false,
  })
    .populate('categoryId', 'name slug')
    .populate({
      path: 'instructorId',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar',
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

  return {
    enrollment,
    course,
    sections,
    lectures,
  };
};

const updateProgress = async (userId, courseId, lectureId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
  });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  const lecture = await CourseLecture.findOne({
    _id: lectureId,
    courseId,
    isDeleted: false,
  });

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const alreadyCompleted = enrollment.completedLectures.some(
    (id) => id.toString() === lectureId.toString()
  );

  if (!alreadyCompleted) {
    enrollment.completedLectures.push(lecture._id);

    const totalLectures = await CourseLecture.countDocuments({
      courseId,
      isDeleted: false,
    });

    enrollment.progressPercentage = Math.round(
      (enrollment.completedLectures.length / totalLectures) * 100
    );

    if (enrollment.progressPercentage >= 100) {
      enrollment.status = 'completed';

      enrollment.completedAt = new Date();
    }
  }

  enrollment.lastAccessedLecture = lecture._id;

  await enrollment.save();

  return enrollment;
};

const getCourseCurriculum = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  const sections = await CourseSection.find({
    courseId,
    isDeleted: false,
  })
    .sort({
      order: 1,
    })
    .lean();

  const lectures = await CourseLecture.find({
    courseId,
    isDeleted: false,
  })
    .select('_id title duration order sectionId isPreview')
    .sort({
      order: 1,
    })
    .lean();

  const completed = new Set(enrollment.completedLectures.map((id) => id.toString()));

  const sectionMap = new Map();

  sections.forEach((section) => {
    sectionMap.set(section._id.toString(), {
      ...section,
      lectures: [],
    });
  });

  lectures.forEach((lecture) => {
    const section = sectionMap.get(lecture.sectionId.toString());

    if (section) {
      section.lectures.push({
        ...lecture,
        isCompleted: completed.has(lecture._id.toString()),
      });
    }
  });

  return {
    progressPercentage: enrollment.progressPercentage,

    completedLectures: enrollment.completedLectures,

    sections: Array.from(sectionMap.values()),
  };
};

const getLecture = async (userId, courseId, lectureId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  const lecture = await CourseLecture.findOne({
    _id: lectureId,
    courseId,
    isDeleted: false,
  }).lean();

  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const lectures = await CourseLecture.find({
    courseId,
    isDeleted: false,
  })
    .sort({
      sectionId: 1,
      order: 1,
    })
    .select('_id title')
    .lean();

  const currentIndex = lectures.findIndex((l) => l._id.toString() === lectureId.toString());

  const previousLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;

  const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

  const completed = enrollment.completedLectures.some(
    (id) => id.toString() === lectureId.toString()
  );

  return {
    lecture,

    previousLecture,

    nextLecture,

    progressPercentage: enrollment.progressPercentage,

    isCompleted: completed,
  };
};

const getCourseProgress = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  const totalLectures = await CourseLecture.countDocuments({
    courseId,
    isDeleted: false,
  });

  return {
    courseId,

    totalLectures,

    completedLectures: enrollment.completedLectures.length,

    progressPercentage: enrollment.progressPercentage,

    lastAccessedLecture: enrollment.lastAccessedLecture,

    isCompleted: enrollment.status === 'completed',

    completedAt: enrollment.completedAt,
  };
};

const getResumeLecture = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  if (enrollment.lastAccessedLecture) {
    const lecture = await CourseLecture.findOne({
      _id: enrollment.lastAccessedLecture,
      courseId,
      isDeleted: false,
    });

    if (lecture) {
      return {
        lectureId: lecture._id,
        sectionId: lecture.sectionId,
      };
    }
  }

  const firstLecture = await CourseLecture.findOne({
    courseId,
    isDeleted: false,
  }).sort({
    order: 1,
  });

  if (!firstLecture) {
    throw new Error('Course has no lectures');
  }

  return {
    lectureId: firstLecture._id,

    sectionId: firstLecture.sectionId,
  };
};

const completeCourse = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    studentId: userId,
    courseId,
    status: {
      $ne: 'cancelled',
    },
  });

  if (!enrollment) {
    throw new Error('You are not enrolled in this course');
  }

  const totalLectures = await CourseLecture.countDocuments({
    courseId,
    isDeleted: false,
  });

  if (enrollment.completedLectures.length < totalLectures) {
    throw new Error('Complete all lectures first');
  }

  enrollment.status = 'completed';

  enrollment.progressPercentage = 100;

  enrollment.completedAt = new Date();

  await enrollment.save();

  return enrollment;
};

module.exports = {
  getMyLearning,
  getCourse,
  getCourseCurriculum,
  getLecture,
  updateProgress,
  getCourseProgress,
  getResumeLecture,
  completeCourse,
};
