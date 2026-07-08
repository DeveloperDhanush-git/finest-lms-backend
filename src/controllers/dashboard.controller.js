const dashboardService = require('../services/dashboard.service');

const getStudentDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getStudentDashboard(req.user._id);

    return res.status(200).json({
      success: true,

      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
};
