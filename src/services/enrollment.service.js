const Enrollment =
  require("../models/enrollment.model");

const Course =
  require("../models/course.model");

const InstructorProfile =
  require("../models/instructor.model");

const CourseSection =
  require("../models/section.model");

const CourseLecture =
  require("../models/lecture.model");

const enrollCourse = async (
  userId,
  courseId
) => {

  const course =
    await Course.findOne({
      _id: courseId,
      status: "published",
      isDeleted: false,
    });

  if (!course) {
    throw new Error(
      "Course not found"
    );
  }

  const instructor =
    await InstructorProfile.findOne({
      _id:
        course.instructorId,
    });

  if (
    instructor &&
    instructor.userId.toString() ===
      userId.toString()
  ) {
    throw new Error(
      "You cannot enroll in your own course"
    );
  }

  const existingEnrollment =
    await Enrollment.findOne({
      studentId: userId,
      courseId,
    });

  if (
    existingEnrollment
  ) {
    throw new Error(
      "Already enrolled"
    );
  }

  const enrollment =
    await Enrollment.create({
      studentId:
        userId,
      courseId,
    });

  await Course.findByIdAndUpdate(
    courseId,
    {
      $inc: {
        totalEnrollments: 1,
      },
    }
  );

  return enrollment;
};

const getMyEnrollments =
  async (userId) => {

    return await Enrollment.find({
      studentId: userId,
      status: "active",
    })
      .populate({
        path: "courseId",
        populate: [
          {
            path:
              "categoryId",
            select:
              "name slug",
          },
          {
            path:
              "instructorId",
            populate: {
              path:
                "userId",
              select:
                "firstName lastName avatar",
            },
          },
        ],
      })
      .sort({
        createdAt: -1,
      });
  };

const getEnrolledCourse =
  async (
    userId,
    courseId
  ) => {

    const enrollment =
      await Enrollment.findOne({
        studentId:
          userId,
        courseId,
      });

    if (
      !enrollment
    ) {
      throw new Error(
        "You are not enrolled in this course"
      );
    }

    const course =
      await Course.findById(
        courseId
      )
        .populate(
          "categoryId",
          "name slug"
        )
        .populate({
          path:
            "instructorId",
          populate: {
            path:
              "userId",
            select:
              "firstName lastName avatar",
          },
        });

    const sections =
      await CourseSection.find({
        courseId,
        isDeleted: false,
      }).sort({
        order: 1,
      });

    const lectures =
      await CourseLecture.find({
        courseId,
        isDeleted: false,
      }).sort({
        order: 1,
      });

    return {
      enrollment,
      course,
      sections,
      lectures,
    };
  };

const checkEnrollment =
  async (
    userId,
    courseId
  ) => {

    const enrollment =
      await Enrollment.findOne({
        studentId:
          userId,
        courseId,
      });

    return {
      isEnrolled:
        !!enrollment,
    };
  };

const updateProgress =
  async (
    userId,
    courseId,
    lectureId
  ) => {

    const enrollment =
      await Enrollment.findOne({
        studentId:
          userId,
        courseId,
      });

    if (
      !enrollment
    ) {
      throw new Error(
        "Enrollment not found"
      );
    }

    const alreadyCompleted =
      enrollment.completedLectures.some(
        (id) =>
          id.toString() ===
          lectureId.toString()
      );

    if (
      !alreadyCompleted
    ) {

      enrollment.completedLectures.push(
        lectureId
      );

      const totalLectures =
        await CourseLecture.countDocuments(
          {
            courseId,
            isDeleted:
              false,
          }
        );

      enrollment.progressPercentage =
        Math.round(
          (
            enrollment
              .completedLectures
              .length /
            totalLectures
          ) *
            100
        );

      if (
        enrollment.progressPercentage >=
        100
      ) {

        enrollment.status =
          "completed";

        enrollment.completedAt =
          new Date();
      }
    }

    enrollment.lastAccessedLecture =
      lectureId;

    await enrollment.save();

    return enrollment;
  };

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getEnrolledCourse,
  checkEnrollment,
  updateProgress,
};