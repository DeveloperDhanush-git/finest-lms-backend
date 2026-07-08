const AppError = require('./appError');
const BadRequestError = require('./badRequestError');
const UnauthorizedError = require('./unauthorizedError');
const ForbiddenError = require('./forbiddenError');
const NotFoundError = require('./notFoundError');
const ConflictError = require('./conflictError');

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
};
