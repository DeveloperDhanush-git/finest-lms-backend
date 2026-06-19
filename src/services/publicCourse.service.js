const Course = require("../models/course.model");
const CourseSection =
  require("../models/section.model");

const CourseLecture =
  require("../models/lecture.model");
  
const getPublicCourses = async (query) => {

  const {
    page = 1,
    limit = 10,
    search,
    category,
    level,
    minPrice,
    maxPrice,
    sort = "newest",
  } = query;

  const filters = {
    status: "published",
    isDeleted: false,
  };

  if (search) {
    filters.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        subtitle: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    filters.categoryId = category;
  }

  if (level) {
    filters.level = level;
  }

  if (
    minPrice ||
    maxPrice
  ) {
    filters.price = {};

    if (minPrice) {
      filters.price.$gte =
        Number(minPrice);
    }

    if (maxPrice) {
      filters.price.$lte =
        Number(maxPrice);
    }
  }

  let sortOptions = {
    createdAt: -1,
  };

  switch (sort) {

    case "popular":
      sortOptions = {
        totalEnrollments: -1,
      };
      break;

    case "rating":
      sortOptions = {
        averageRating: -1,
      };
      break;

    case "price_low":
      sortOptions = {
        price: 1,
      };
      break;

    case "price_high":
      sortOptions = {
        price: -1,
      };
      break;

    default:
      sortOptions = {
        createdAt: -1,
      };
  }

  const skip =
    (page - 1) * limit;

  const courses =
    await Course.find(filters)
      .populate(
        {
          path: "categoryId",
          select:
            "name slug",
        }
      )
      .populate({
        path:
          "instructorId",
        select:
          "headline averageRating totalStudents",
        populate: {
          path: "userId",
          select:
            "firstName lastName avatar",
        },
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

  const total =
    await Course.countDocuments(
      filters
    );

  return {
    courses,
    pagination: {
      total,
      page:
        Number(page),
      limit:
        Number(limit),
      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};

const getPublicCourseById =
  async (courseId) => {

    const course =
      await Course.findOne({
        _id: courseId,
        status: "published",
        isDeleted: false,
      })
      .populate(
        "categoryId",
        "name slug"
      )
      .populate({
        path:
          "instructorId",
        populate: {
          path: "userId",
          select:
            "firstName lastName avatar",
        },
      });

    if (!course) {
      throw new Error(
        "Course not found"
      );
    }

    const sections =
      await CourseSection.find({
        courseId,
        isDeleted: false,
      });

    const lectures =
      await CourseLecture.find({
        courseId,
        isDeleted: false,
      }).select(
        "title duration isPreview sectionId"
      );

    return {
      course,
      sections,
      lectures,
    };
};

module.exports = {
  getPublicCourses,
  getPublicCourseById,
};