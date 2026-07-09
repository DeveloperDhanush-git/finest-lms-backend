const instructorService = require('../services/instructor.service');
const { asyncHandler, success } = require('../helpers');

const getInstructorProfile = asyncHandler(async (req, res) => {
  const profile = await instructorService.getProfile(req.user._id);
  return success(res, 'Instructor profile retrieved successfully', profile);
});

const updateInstructorProfile = asyncHandler(async (req, res) => {
  const profile = await instructorService.updateProfile(req.user._id, req.body);
  return success(res, 'Instructor profile updated successfully', profile);
});

const becomeInstructor = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getInstructorProfile,
  updateInstructorProfile,
  becomeInstructor,
};
