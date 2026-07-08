const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/jwt");
const { UnauthorizedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Unauthorized access: Bearer token is missing");
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired access token", "INVALID_TOKEN");
    }

    const user = await User.findOne({
      _id: decoded.id,
      accountStatus: "active",
    }).select(
      "_id firstName lastName email role avatar phone countryCode accountStatus",
    );

    if (!user) {
      throw new UnauthorizedError("User session found but user is inactive or not found", "USER_INACTIVE");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
