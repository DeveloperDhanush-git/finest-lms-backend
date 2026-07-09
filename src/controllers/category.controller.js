const categoryService = require('../services/category.service');
const { asyncHandler, success, created } = require('../helpers');

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return created(res, 'Category created successfully', category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return success(res, 'Categories retrieved successfully', categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return success(res, 'Category retrieved successfully', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return success(res, 'Category updated successfully', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return success(res, 'Category deleted successfully');
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
