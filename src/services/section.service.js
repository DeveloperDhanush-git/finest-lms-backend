const Course =
  require("../models/course.model");

const CourseSection =
  require("../models/section.model");

const CourseLecture =
  require("../models/lecture.model");

const InstructorProfile =
  require("../models/instructor.model");

const createSection = async (
  userId,
  courseId,
  data
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

  if (data.order) {
    const existingSection =
      await CourseSection.findOne({
        courseId,
        order: data.order,
        isDeleted: false,
      });

    if (existingSection) {
      throw new Error(
        "Section with this order already exists"
      );
    }
  }

  const section =
    await CourseSection.create({
      ...data,
      courseId,
    });

  return section;
};

const getSections = async (
  courseId
) => {

  return await CourseSection.find({
    courseId,
    isDeleted: false,
  }).sort({
    order: 1,
  });
};

const updateSection = async (
  sectionId,
  userId,
  data
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

  const section =
    await CourseSection.findById(
      sectionId
    );

  if (!section) {
    throw new Error(
      "Section not found"
    );
  }

  const course =
    await Course.findOne({
      _id: section.courseId,
      instructorId:
        instructor._id,
      isDeleted: false,
    });

  if (!course) {
    throw new Error(
      "Unauthorized to update this section"
    );
  }

  if (
    data.order &&
    data.order !== section.order
  ) {
    const existingSection =
      await CourseSection.findOne({
        courseId: section.courseId,
        order: data.order,
        isDeleted: false,
        _id: {
          $ne: sectionId,
        },
      });

    if (existingSection) {
      throw new Error(
        "Section with this order already exists"
      );
    }
  }

  const updatedSection =
    await CourseSection.findByIdAndUpdate(
      sectionId,
      data,
      {
        returnDocument:
          "after",
        runValidators:
          true,
      }
    );

  return updatedSection;
};

const deleteSection = async (
  sectionId,
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

  const section =
    await CourseSection.findById(
      sectionId
    );

  if (!section) {
    throw new Error(
      "Section not found"
    );
  }

  const course =
    await Course.findOne({
      _id: section.courseId,
      instructorId:
        instructor._id,
      isDeleted: false,
    });

  if (!course) {
    throw new Error(
      "Unauthorized to delete this section"
    );
  }

  const deletedSection =
    await CourseSection.findOneAndUpdate(
      {
        _id: sectionId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: "after",
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

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
};