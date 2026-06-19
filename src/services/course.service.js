const Course = require("../models/course.model");
const Category = require("../models/category.model");
const CourseSection = require("../models/section.model");
const CourseLecture = require("../models/lecture.model");
const InstructorProfile = require("../models/instructor.model");

const createCourse = async (
  userId,
  courseData
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Create instructor profile first"
    );
  }

  const category =
    await Category.findOne({
      _id: courseData.categoryId,
      isActive: true,
    });

  if (!category) {
    throw new Error(
      "Category not found"
    );
  }

  const course =
    await Course.create({
      ...courseData,
      instructorId:
        instructor._id,
    });

  return course;
};

const getMyCourses = async (
  userId
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Instructor profile not found"
    );
  }

  return await Course.find({
    instructorId:
      instructor._id,
    isDeleted: false,
  })
    .populate(
      "categoryId",
      "name"
    )
    .sort({
      createdAt: -1,
    });
};

const getCourseById = async (
  courseId,
  userId
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Instructor profile not found"
    );
  }

  const course =
    await Course.findOne({
      _id: courseId,
      instructorId:
        instructor._id,
      isDeleted: false,
    })
      .populate(
        "categoryId",
        "name"
      )
      .populate(
        "instructorId"
      );

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  return course;
};

const updateCourse = async (
  courseId,
  userId,
  updateData
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });
    if (!instructor) {
  throw new Error(
    "Instructor profile not found"
  );
}

  const course =
    await Course.findOneAndUpdate(
      {
        _id: courseId,
        instructorId:
          instructor._id,
        isDeleted: false,
      },
      updateData,
      {
        returnDocument:
          "after",
        runValidators:
          true,
      }
    );

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  return course;
};

const deleteCourse = async (
  courseId,
  userId
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Instructor profile not found"
    );
  }

  const course =
    await Course.findOneAndUpdate(
      {
        _id: courseId,
        instructorId:
          instructor._id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument:
          "after",
      }
    );

  if (!course) {
    throw new Error(
      "Course not found"
    );
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

const publishCourse = async (
  courseId,
  userId
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Instructor profile not found"
    );
  }

  const course =
    await Course.findOne({
      _id: courseId,
      instructorId:
        instructor._id,
      isDeleted: false,
    });

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  if (
    course.status ===
    "published"
  ) {
    throw new Error(
      "Course already published"
    );
  }

  const category =
    await Category.findOne({
      _id: course.categoryId,
      isActive: true,
    });

  if (!category) {
    throw new Error(
      "Invalid category"
    );
  }

  if (!course.title) {
    throw new Error(
      "Course title required"
    );
  }

  if (!course.description) {
    throw new Error(
      "Course description required"
    );
  }

  if (!course.thumbnail) {
    throw new Error(
      "Course thumbnail required"
    );
  }

  if (
    !course.learningObjectives ||
    course.learningObjectives.length === 0
  ) {
    throw new Error(
      "Add at least one learning objective"
    );
  }

  if (
    !course.requirements ||
    course.requirements.length === 0
  ) {
    throw new Error(
      "Add at least one requirement"
    );
  }

  const sections =
    await CourseSection.find({
      courseId: course._id,
      isDeleted: false,
    });

  if (
    sections.length === 0
  ) {
    throw new Error(
      "Course must contain at least one section"
    );
  }

  const sectionIds =
    sections.map(
      (section) =>
        section._id
    );

  const lectures =
    await CourseLecture.find({
      sectionId: {
        $in: sectionIds,
      },
      isDeleted: false,
    });

  if (
    lectures.length === 0
  ) {
    throw new Error(
      "Course must contain at least one lecture"
    );
  }

  course.status =
    "published";

  course.publishedAt =
    new Date();

  await course.save();

  return course;
};

const unpublishCourse = async (
  courseId,
  userId
) => {

  const instructor =
    await InstructorProfile.findOne({
      userId,
    });

  if (!instructor) {
    throw new Error(
      "Instructor profile not found"
    );
  }

  const course =
    await Course.findOne({
      _id: courseId,
      instructorId:
        instructor._id,
      isDeleted: false,
    });

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  if (
    course.status !==
    "published"
  ) {
    throw new Error(
      "Course is not published"
    );
  }

  course.status =
    "draft";

  course.publishedAt =
    null;

  await course.save();

  return course;
};

module.exports = {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
};