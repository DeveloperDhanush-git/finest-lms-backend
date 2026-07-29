const instructorDashboardService = require('../services/instructorDashboard.service');
const { asyncHandler, success } = require('../helpers');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await instructorDashboardService.getDashboard(req.user._id);
  return success(res, 'Instructor dashboard retrieved successfully', dashboard);
});

module.exports = {
  getDashboard,
};
