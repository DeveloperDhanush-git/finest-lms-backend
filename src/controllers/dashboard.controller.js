const dashboardService = require('../services/dashboard.service');
const { asyncHandler, success } = require('../helpers');

const getStudentDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getStudentDashboard(req.user._id);
  return success(res, 'Student dashboard retrieved successfully', dashboard);
});

module.exports = {
  getStudentDashboard,
};
