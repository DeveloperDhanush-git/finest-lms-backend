const adminDashboardService = require('../services/adminDashboard.service');
const { asyncHandler, success } = require('../helpers');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await adminDashboardService.getDashboard();
  return success(res, 'Admin dashboard retrieved successfully', dashboard);
});

module.exports = {
  getDashboard,
};
