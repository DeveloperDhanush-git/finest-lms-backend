const CourseLecture = require(
  "../models/lecture.model"
);

const Course = require(
  "../models/course.model"
);

const CourseSection = require(
  "../models/section.model"
);

const InstructorProfile = require("../models/instructor.model")

const createLecture = async (
  userId, data
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
    _id: data.courseId,
    instructorId:
      instructor._id,
    isDeleted: false,
  });

if (!course) {
  throw new Error(
    "Course not found or access denied"
  );
}

  const section =
  await CourseSection.findOne({
    _id: data.sectionId,
    courseId:
      data.courseId,
  });

if (!section) {
  throw new Error(
    "Section not found in course"
  );
}

  const lecture =
    await CourseLecture.create(
      data
    );

  await Course.findByIdAndUpdate(
    data.courseId,
    {
      $inc: {
        totalLectures: 1,
        totalDuration:
          data.duration,
      },
    }
  );

  await CourseSection.findByIdAndUpdate(
    data.sectionId,
    {
      $inc: {
        totalLectures: 1,
        totalDuration:
          data.duration,
      },
    }
  );

  return lecture;
};

const getLecturesBySection =
  async (sectionId) => {

    return await CourseLecture.find({
      sectionId,
      isDeleted: false,
    }).sort({
      order: 1,
    });
  };

const updateLecture =
  async (
    lectureId,
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

    const oldLecture =
      await CourseLecture.findById(
        lectureId
      );

    if (!oldLecture) {
      throw new Error(
        "Lecture not found"
      );
    }

    const course =
      await Course.findOne({
        _id: oldLecture.courseId,
        instructorId:
          instructor._id,
        isDeleted: false,
      });

    if (!course) {
      throw new Error(
        "Unauthorized to update this lecture"
      );
    }

    const durationDiff =
      (updateData.duration ||
        oldLecture.duration) -
      oldLecture.duration;

    const lecture =
      await CourseLecture.findByIdAndUpdate(
        lectureId,
        updateData,
        {
          returnDocument:
            "after",
          runValidators:
            true,
        }
      );

    if (durationDiff !== 0) {
      await Course.findByIdAndUpdate(
        lecture.courseId,
        {
          $inc: {
            totalDuration:
              durationDiff,
          },
        }
      );

      await CourseSection.findByIdAndUpdate(
        lecture.sectionId,
        {
          $inc: {
            totalDuration:
              durationDiff,
          },
        }
      );
    }

    return lecture;
  };

const deleteLecture =
  async (lectureId, userId) => {

    const instructor =
      await InstructorProfile.findOne({
        userId,
      });

    if (!instructor) {
      throw new Error(
        "Instructor profile not found"
      );
    }

    const lecture =
      await CourseLecture.findById(
        lectureId
      );

    if (!lecture) {
      throw new Error(
        "Lecture not found"
      );
    }

    const course =
      await Course.findOne({
        _id: lecture.courseId,
        instructorId:
          instructor._id,
        isDeleted: false,
      });

    if (!course) {
      throw new Error(
        "Unauthorized to delete this lecture"
      );
    }

    const deletedLecture =
      await CourseLecture.findOneAndUpdate(
        {
          _id: lectureId,
          isDeleted: false,
        },
        {
          isDeleted: true,
        },
        {
          returnDocument: "after",
        }
      );

    if (!deletedLecture) {
      throw new Error(
        "Lecture not found"
      );
    }

    await Course.findByIdAndUpdate(
      lecture.courseId,
      {
        $inc: {
          totalLectures: -1,
          totalDuration:
            -lecture.duration,
        },
      }
    );

    await CourseSection.findByIdAndUpdate(
      lecture.sectionId,
      {
        $inc: {
          totalLectures: -1,
          totalDuration:
            -lecture.duration,
        },
      }
    );

    return deletedLecture;
  };

module.exports = {
  createLecture,
  getLecturesBySection,
  updateLecture,
  deleteLecture,
};