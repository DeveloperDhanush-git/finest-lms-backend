const sectionService = require('../services/section.service');
const { asyncHandler, success, created } = require('../helpers');

const createSection = asyncHandler(async (req, res) => {
  const section = await sectionService.createSection(req.user._id, req.params.courseId, req.body);
  return created(res, 'Section created successfully', section);
});

const getSections = asyncHandler(async (req, res) => {
  const sections = await sectionService.getSections(req.params.courseId, req.user._id);
  return success(res, 'Sections retrieved successfully', sections);
});

const updateSection = asyncHandler(async (req, res) => {
  const section = await sectionService.updateSection(req.params.id, req.user._id, req.body);
  return success(res, 'Section updated successfully', section);
});

const deleteSection = asyncHandler(async (req, res) => {
  await sectionService.deleteSection(req.params.id, req.user._id);
  return success(res, 'Section deleted successfully');
});

const reorderSections = asyncHandler(async (req, res) => {
  const sections = await sectionService.reorderSections(req.params.courseId, req.user._id, req.body.orderedIds);
  return success(res, 'Sections reordered successfully', sections);
});

module.exports = {
  createSection,
  getSections,
  updateSection,
  deleteSection,
  reorderSections,
};
