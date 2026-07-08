const adminDashboardService = require('../services/adminDashboard.service');

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminDashboardService.getDashboard();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
