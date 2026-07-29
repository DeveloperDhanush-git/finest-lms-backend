const slugify = require('slugify');

const Category = require('../models/category.model');

const createCategory = async (data) => {
  const slug = slugify(data.name, {
    lower: true,
    strict: true,
  });

  const existingCategory = await Category.findOne({
    slug,
  });

  if (existingCategory) {
    if (!existingCategory.isActive) {
      existingCategory.isActive = true;

      existingCategory.description = data.description || existingCategory.description;

      existingCategory.parentCategory = data.parentCategory || null;

      await existingCategory.save();

      return existingCategory;
    }

    throw new Error('Category already exists');
  }

  const category = await Category.create({
    ...data,
    slug,
  });

  return category;
};

const getAllCategories = async () => {
  return await Category.find({
    isActive: true,
  })
    .populate('parentCategory', 'name slug')
    .sort({
      name: 1,
    });
};

const getCategoryById = async (id) => {
  const category = await Category.findOne({
    _id: id,
    isActive: true,
  }).populate('parentCategory', 'name slug');

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const updateCategory = async (id, updateData) => {
  if (updateData.name) {
    updateData.slug = slugify(updateData.name, {
      lower: true,
      strict: true,
    });

    const existingCategory = await Category.findOne({
      slug: updateData.slug,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new Error('Category already exists');
    }
  }

  const category = await Category.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    updateData,
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
    },
    {
      isActive: false,
    },
    {
      returnDocument: 'after',
    }
  );

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
