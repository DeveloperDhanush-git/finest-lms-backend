const { UnauthorizedError, ForbiddenError } = require('../errors');
const { asyncHandler } = require('../helpers');

const roleMiddleware = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Forbidden: Access denied');
    }

    next();
  });
};

module.exports = roleMiddleware;
