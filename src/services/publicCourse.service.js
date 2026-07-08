const mongoose = require('mongoose');
const Course = require('../models/course.model');
const CourseSection = require('../models/section.model');

const CourseLecture = require('../models/lecture.model');
const { getSearchSuggestions } = require('./course.service');

const getPublicCourses = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    level,
    language,
    rating,
    priceType,
    minPrice,
    maxPrice,
    sort = 'relevance',
  } = query;
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(Math.max(1, Number(limit) || 12), 100);
  const cleanedSearch = typeof search === 'string' ? search.trim() : '';
  const parsedRating = Number(rating);
  const parsedMinPrice = Number(minPrice);
  const parsedMaxPrice = Number(maxPrice);

  const filters = {
    status: 'published',
    isDeleted: false,
  };

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new Error('Invalid category id');
    }

    filters.categoryId = new mongoose.Types.ObjectId(category);
  }

  if (level) {
    filters.level = level;
  }

  if (language) {
    filters.language = language;
  }

  if (rating !== undefined && !Number.isNaN(parsedRating)) {
    filters.averageRating = {
      $gte: parsedRating,
    };
  }

  if (priceType === 'free') {
    filters.$or = [{ price: 0 }, { discountPrice: 0 }];
  }

  const effectivePriceExpression = {
    $cond: [{ $gt: ['$discountPrice', 0] }, '$discountPrice', '$price'],
  };

  const priceExpressions = [];

  if (priceType === 'paid') {
    priceExpressions.push({
      $gt: [effectivePriceExpression, 0],
    });
  }

  if (minPrice !== undefined && !Number.isNaN(parsedMinPrice)) {
    priceExpressions.push({
      $gte: [effectivePriceExpression, parsedMinPrice],
    });
  }

  if (maxPrice !== undefined && !Number.isNaN(parsedMaxPrice)) {
    priceExpressions.push({
      $lte: [effectivePriceExpression, parsedMaxPrice],
    });
  }

  if (priceExpressions.length) {
    filters.$expr = {
      $and: priceExpressions,
    };
  }

  const basePipeline = [];

  if (cleanedSearch) {
    basePipeline.push({
      $search: {
        index: 'course-search',
        compound: {
          should: [
            {
              phrase: {
                query: cleanedSearch,
                path: 'title',
                score: {
                  boost: {
                    value: 20,
                  },
                },
              },
            },
            {
              autocomplete: {
                query: cleanedSearch,
                path: 'title',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 15,
                  },
                },
              },
            },
            {
              autocomplete: {
                query: cleanedSearch,
                path: 'subtitle',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 12,
                  },
                },
              },
            },
            {
              text: {
                query: cleanedSearch,
                path: 'tags',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 9,
                  },
                },
              },
            },
            {
              text: {
                query: cleanedSearch,
                path: 'learningObjectives',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 7,
                  },
                },
              },
            },
            {
              text: {
                query: cleanedSearch,
                path: 'requirements',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 6,
                  },
                },
              },
            },
            {
              text: {
                query: cleanedSearch,
                path: 'description',
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 2,
                },
                score: {
                  boost: {
                    value: 4,
                  },
                },
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    });
  }

  basePipeline.push({
    $match: filters,
  });

  basePipeline.push({
    $addFields: {
      effectivePrice: effectivePriceExpression,
    },
  });

  const resultPipeline = [...basePipeline];

  if (cleanedSearch) {
    resultPipeline.push({
      $addFields: {
        score: {
          $meta: 'searchScore',
        },
      },
    });
  }

  const sortOptions = (() => {
    const defaultRelevance = cleanedSearch ? { score: -1, createdAt: -1 } : { createdAt: -1 };

    switch (sort) {
      case 'newest':
        return cleanedSearch ? { createdAt: -1, score: -1 } : { createdAt: -1 };
      case 'popular':
        return cleanedSearch ? { totalEnrollments: -1, score: -1 } : { totalEnrollments: -1 };
      case 'rating':
        return cleanedSearch ? { averageRating: -1, score: -1 } : { averageRating: -1 };
      case 'price_low':
        return cleanedSearch ? { effectivePrice: 1, score: -1 } : { effectivePrice: 1 };
      case 'price_high':
        return cleanedSearch ? { effectivePrice: -1, score: -1 } : { effectivePrice: -1 };
      case 'relevance':
      default:
        return defaultRelevance;
    }
  })();

  resultPipeline.push({
    $sort: sortOptions,
  });

  resultPipeline.push({
    $project: {
      _id: 1,
      title: 1,
      subtitle: 1,
      description: 1,
      thumbnail: 1,
      categoryId: 1,
      instructorId: 1,
      price: 1,
      discountPrice: 1,
      averageRating: 1,
      totalEnrollments: 1,
      createdAt: 1,
      effectivePrice: 1,
      ...(cleanedSearch && {
        score: {
          $meta: 'searchScore',
        },
      }),
    },
  });

  resultPipeline.push(
    {
      $skip: (parsedPage - 1) * parsedLimit,
    },
    {
      $limit: parsedLimit,
    }
  );
  const courses = await Course.aggregate(resultPipeline).allowDiskUse(true);

  await Course.populate(courses, [
    {
      path: 'categoryId',
      select: 'name slug',
    },
    {
      path: 'instructorId',
      select: 'headline averageRating totalStudents',
      populate: {
        path: 'userId',
        select: 'firstName lastName avatar',
      },
    },
  ]);

  const countPipeline = [...basePipeline, { $count: 'total' }];
  const totalResult = await Course.aggregate(countPipeline).allowDiskUse(true);
  const total = totalResult[0]?.total || 0;

  return {
    courses,
    pagination: {
      total,
      currentPage: parsedPage,
      pageSize: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

const getPublicCourseById = async (courseId) => {
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
  });

  const lectures = await CourseLecture.find({
    courseId,
    isDeleted: false,
  }).select('title duration isPreview sectionId');

  return {
    course,
    sections,
    lectures,
  };
};

module.exports = {
  getPublicCourses,
  getPublicCourseById,
  getSearchSuggestions,
};
