const { HTTP_STATUS_CODES } = require('../constants');

class AppError extends Error {
    constructor(message, statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
        super(message, HTTP_STATUS_CODES.BAD_REQUEST, errorCode);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
        super(message, HTTP_STATUS_CODES.UNAUTHORIZED, errorCode);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
        super(message, HTTP_STATUS_CODES.FORBIDDEN, errorCode);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found', errorCode = 'NOT_FOUND') {
        super(message, HTTP_STATUS_CODES.NOT_FOUND, errorCode);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict', errorCode = 'CONFLICT') {
        super(message, HTTP_STATUS_CODES.CONFLICT, errorCode);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
};
