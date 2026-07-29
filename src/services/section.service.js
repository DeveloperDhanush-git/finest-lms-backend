const Course = require('../models/course.model');
const CourseSection = require('../models/section.model');
const CourseLecture = require('../models/lecture.model');
const InstructorProfile = require('../models/instructor.model');
const { NotFoundError, ForbiddenError, ConflictError } = require('../errors');

const createSection = async (userId, courseId, data) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new NotFoundError('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  if (data.order) {
    const existingSection = await CourseSection.findOne({
      courseId,
      order: data.order,
      isDeleted: false,
    });

    if (existingSection) {
      throw new ConflictError('Section with this order already exists');
    }
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const section = await CourseSection.create({
    ...data,
    courseId,
  });

  return section;
};

const getSections = async (courseId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor?._id,
    isDeleted: false,
  });

  if (!course) {
    throw new ForbiddenError('Course not found or access denied');
  }

  return await CourseSection.find({
    courseId,
    isDeleted: false,
  }).sort({
    order: 1,
  });
};

const updateSection = async (sectionId, userId, data) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new NotFoundError('Instructor profile not found');
  }

  const section = await CourseSection.findById(sectionId);

  if (!section) {
    throw new NotFoundError('Section not found');
  }

  const course = await Course.findOne({
    _id: section.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new ForbiddenError('Unauthorized to update this section');
  }

  if (data.order && data.order !== section.order) {
    const existingSection = await CourseSection.findOne({
      courseId: section.courseId,
      order: data.order,
      isDeleted: false,
      _id: {
        $ne: sectionId,
      },
    });

    if (existingSection) {
      throw new ConflictError('Section with this order already exists');
    }
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const updatedSection = await CourseSection.findByIdAndUpdate(sectionId, data, {
    returnDocument: 'after',
    runValidators: true,
  });

  return updatedSection;
};

const deleteSection = async (sectionId, userId) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new NotFoundError('Instructor profile not found');
  }

  const section = await CourseSection.findById(sectionId);

  if (!section) {
    throw new NotFoundError('Section not found');
  }

  const course = await Course.findOne({
    _id: section.courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new ForbiddenError('Unauthorized to delete this section');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const deletedSection = await CourseSection.findOneAndUpdate(
    {
      _id: sectionId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      returnDocument: 'after',
    }
  );

  await CourseLecture.updateMany(
    {
      sectionId,
    },
    {
      isDeleted: true,
    }
  );

  return deletedSection;
};

const reorderSections = async (courseId, userId, orderedIds) => {
  const instructor = await InstructorProfile.ensureProfileForUser(userId);

  if (!instructor) {
    throw new NotFoundError('Instructor profile not found');
  }

  const course = await Course.findOne({
    _id: courseId,
    instructorId: instructor._id,
    isDeleted: false,
  });

  if (!course) {
    throw new ForbiddenError('Course not found or access denied');
  }

  if (course.status === 'published') {
    course.status = 'draft';
    await course.save();
  }

  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, courseId, isDeleted: false },
      update: { $set: { order: index + 1 } },
    },
  }));

  await CourseSection.bulkWrite(ops);

  return await CourseSection.find({ courseId, isDeleted: false }).sort({ order: 1 });
};

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
  reorderSections,
};
