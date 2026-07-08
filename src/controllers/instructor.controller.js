const instructorService = require('../services/instructor.service');

const getInstructorProfile = async (req, res, next) => {
  try {
    const profile = await instructorService.getProfile(req.user._id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateInstructorProfile = async (req, res, next) => {
  try {
    const profile = await instructorService.updateProfile(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Instructor profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
const becomeInstructor = async (req, res, next) => {
  try {
    const { user, profile, accessToken, refreshToken } = await instructorService.becomeInstructor(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'You are now an instructor',
      data: {
        user,
        profile,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstructorProfile,
  updateInstructorProfile,
  becomeInstructor,
};
