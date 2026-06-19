const { success } = require("zod");
const userService =
  require("../services/user.service");

const getUserProfile = async (req, res, next) => {
    try {
      const user = await userService.getUserDetails(req.user._id);
      
      return res.status(200).json({
        success: true,
        message:
          "Profile fetched successfully",
        data: {
          id: user._id,
          firstName:
            user.firstName,
          lastName:
            user.lastName,
          fullName:
            `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          countryCode:
            user.countryCode,
          accountStatus:
            user.accountStatus,
          createdAt:
            user.createdAt,
        },
      });

    } catch (error) {
      next(error);
    }
  };

const updateUserProfile = async (req,res,next)=>{
  try{
    const user = await userService.updateUserDetails(req.user._id,req.body);
    return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        data: {
          id: user._id,
          firstName:
            user.firstName,
          lastName:
            user.lastName,
          fullName:
            `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          countryCode:
            user.countryCode,
          accountStatus:
            user.accountStatus,
        },
    });
  }
  catch(error){
    next(error);
  }
};

const deleteUserProfile = async (req,res,next) => {
  try {
    await userService.deleteUser(req.user._id);
    
    return res.status(200).json({
      success: true,
      message:
        "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};