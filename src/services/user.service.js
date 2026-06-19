const User = require("../models/user.model");
const refreshToken = require('../models/refreshToken.model')

const getUserDetails = async (userId) => {
  const user =
    await User.findById(userId)
      .select(
        "firstName lastName email role avatar phone countryCode accountStatus createdAt"
      );

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return user;
};
const updateUserDetails = async (userId, updateData)=>{
    const allowedUpdates = {};
    if (updateData.firstName !== undefined) {
      allowedUpdates.firstName =
      updateData.firstName;
    }
  
    if (updateData.lastName !== undefined) {
      allowedUpdates.lastName =
      updateData.lastName;
    }
  
    if (updateData.phone !== undefined) {
      allowedUpdates.phone =
      updateData.phone;
    }
  
    if (updateData.avatar !== undefined) {
      allowedUpdates.avatar =
      updateData.avatar;
    }
    const user = await User.findByIdAndUpdate(
    userId,
    allowedUpdates,
    {
      returnDocument: "after",
      runValidators: true,
      projection:
        "firstName lastName email role avatar phone countryCode accountStatus createdAt",
      }
    );
     if (!user) {
      throw new Error("User not found");
    }
    return user; 
}

const deleteUser = async (userId)=>{
  const user= await User.findByIdAndUpdate(
    userId,
    {
      accountStatus: "deleted",
      deletedAt: new Date(),
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  )
  if(!user){
    throw new Error("User Not Found")
  }

  await refreshToken.updateMany(
    {userId},
    {isRevoked: true}
  )
  return user;
};

module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUser
};