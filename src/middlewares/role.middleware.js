const { UnauthorizedError, ForbiddenError } = require('../errors');

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Unauthorized');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('Forbidden: Access denied');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleMiddleware;
