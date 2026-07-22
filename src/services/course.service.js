const Course = require('../models/course.model');
const Category = require('../models/category.model');
const CourseSection = require('../models/section.model');
const CourseLecture = require('../models/lecture.model');
const InstructorProfile = require('../models/instructor.model');
const { deleteFileFromS3 } = require('./s3.service');

const createCourse = async (userId, courseData) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Create instructor profile first');
  }

  const category = await Category.findOne({
    _id: courseData.categoryId,
    isActive: true,
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const course = await Course.create({
    ...courseData,
    instructorId: instructor._id,
  });

  return course;
};

const getMyCourses = async (userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  return await Course.find({
    instructorId: instructor._id,
    isDeleted: false,
  })
    .populate('categoryId', 'name')
    .sort({
      createdAt: -1,
    });
};

const getCourseById = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  })
    .populate('categoryId', 'name')
    .populate('instructorId');

  if (!course) {
    throw new Error('Course not found');
  }

  return course;
};

const updateCourse = async (courseId, userId, updateData) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);
  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOneAndUpdate(
    {
      _id: courseId,
      instructorId: instructor._id,
      isDeleted: false,
    },
    updateData,
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  return course;
};

const deleteCourse = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOneAndUpdate(
    {
      _id: courseId,
      instructorId: instructor._id,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      returnDocument: 'after',
    }
  );

  if (!course) {
    throw new Error('Course not found');
  }

  await CourseSection.updateMany(
    {
      courseId,
    },
    {
      isDeleted: true,
    }
  );

  await CourseLecture.updateMany(
    {
      courseId,
    },
    {
      isDeleted: true,
    }
  );

  return course;
};

const submitCourse = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.status === 'pending') {
    throw new Error('Course already submitted for review');
  }

  if (course.status === 'published') {
    throw new Error('Course already published');
  }

  const category = await Category.findOne({
    _id: course.categoryId,
    isActive: true,
  });

  if (!category) {
    throw new Error('Invalid category');
  }

  if (!course.title?.trim()) {
    throw new Error('Course title required');
  }

  if (!course.description?.trim()) {
    throw new Error('Course description required');
  }

  if (!course.thumbnail) {
    throw new Error('Course thumbnail required');
  }

  const requirements = (course.requirements || []).filter(
    (item) => typeof item === 'string' && item.trim()
  );

  if (requirements.length === 0) {
    throw new Error('Add at least one requirement');
  }

  const learningObjectives = (course.learningObjectives || []).filter(
    (item) => typeof item === 'string' && item.trim()
  );

  if (learningObjectives.length === 0) {
    throw new Error('Add at least one learning objective');
  }

  const sections = await CourseSection.find({
    courseId: course._id,
    isDeleted: false,
  });

  if (sections.length === 0) {
    throw new Error('Course must contain at least one section');
  }

  const sectionIds = sections.map((section) => section._id);

  const lectures = await CourseLecture.find({
    sectionId: {
      $in: sectionIds,
    },
    isDeleted: false,
  });

  if (lectures.length === 0) {
    throw new Error('Course must contain at least one lecture');
  }

  const User = require('../models/user.model');
  const submittingUser = await User.findById(userId);
  const isAdmin = submittingUser && submittingUser.role === 'admin';

  if (isAdmin) {
    course.status = 'published';
    course.publishedAt = new Date();
    course.approvedBy = userId;
    course.approvedAt = new Date();
    course.rejectedBy = null;
    course.rejectedAt = null;
    course.rejectionReason = null;

    // Set all sections of the course to isPublished: true
    await CourseSection.updateMany(
      { courseId: course._id, isDeleted: false },
      { $set: { isPublished: true } }
    );
  } else {
    course.status = 'pending';
    course.publishedAt = null;
    course.approvedBy = null;
    course.approvedAt = null;
    course.rejectedBy = null;
    course.rejectedAt = null;
    course.rejectionReason = null;
  }

  await course.save();

  if (!isAdmin) {
    // Send notifications to admins
    try {
      const { createNotification } = require('./notification.service');
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await createNotification({
          recipientId: admin._id,
          senderId: userId, // the instructor
          type: 'COURSE_SUBMITTED',
          title: 'New Course Submitted',
          message: `Instructor has submitted the course "${course.title}" for review.`,
          data: { courseId: course._id },
        });
      }
    } catch (err) {
      console.error('Failed to send COURSE_SUBMITTED notification:', err.message);
    }
  }

  return course;
};

const publishCourse = async (courseId, userId) => submitCourse(courseId, userId);

const unpublishCourse = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.status !== 'published') {
    throw new Error('Course is not published');
  }

  course.status = 'draft';

  course.publishedAt = null;

  await course.save();

  return course;
};

const updateThumbnail = async (courseId, userId, thumbnailUrl, thumbnailKey) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,

    instructorId: instructor._id,

    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.thumbnailKey) {
    await deleteFileFromS3(course.thumbnailKey);
  }

  if (course.status === 'published') {
    course.status = 'draft';
  }

  course.thumbnail = thumbnailUrl;

  course.thumbnailKey = thumbnailKey;

  await course.save();

  return course;
};

const deleteThumbnail = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,

    instructorId: instructor._id,

    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.thumbnailKey) {
    await deleteFileFromS3(course.thumbnailKey);
  }

  if (course.status === 'published') {
    course.status = 'draft';
  }

  course.thumbnail = null;

  course.thumbnailKey = null;

  await course.save();

  return course;
};

const updatePreviewVideo = async (courseId, userId, videoData) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.previewVideo && course.previewVideo.key) {
    await deleteFileFromS3(course.previewVideo.key);
  }

  if (course.status === 'published') {
    course.status = 'draft';
  }

  course.previewVideo = {
    url: videoData.url,
    key: videoData.key,
    duration: videoData.duration || 0,
    size: videoData.size || 0,
    mimeType: videoData.mimeType || null,
  };

  await course.save();

  return course;
};

const deletePreviewVideo = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new Error('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.previewVideo && course.previewVideo.key) {
    await deleteFileFromS3(course.previewVideo.key);
  }

  if (course.status === 'published') {
    course.status = 'draft';
  }

  course.previewVideo = null;

  await course.save();

  return course;
};

const getSearchSuggestions = async (keyword) => {
  if (!keyword?.trim()) {
    return [];
  }

  const searchRegex = new RegExp(keyword.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');

  const results = await Course.find({
    status: 'published',
    isDeleted: false,
    $or: [
      { title: searchRegex },
      { subtitle: searchRegex },
      { description: searchRegex },
      { tags: searchRegex },
    ],
  })
    .limit(8)
    .select('_id title subtitle thumbnail price discountPrice categoryId instructorId');

  await Course.populate(results, [
    {
      path: 'categoryId',
      select: 'name',
    },
    {
      path: 'instructorId',
      select: 'headline',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar',
      },
    },
  ]);

  return results;
};

module.exports = {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  submitCourse,
  publishCourse,
  unpublishCourse,
  updateThumbnail,
  deleteThumbnail,
  updatePreviewVideo,
  deletePreviewVideo,
  getSearchSuggestions,
};
