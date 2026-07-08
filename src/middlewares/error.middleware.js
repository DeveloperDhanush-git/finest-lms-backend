const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');
const { AppError } = require('../errors');

const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    if (err.name === 'CastError') {
        const message = `Invalid resource identifier: ${err.value}`;
        error = {
            message,
            statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
            errorCode: 'INVALID_ID_FORMAT',
            isOperational: true,
        };
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate value '${value}' entered for field '${field}'. Please use another value!`;
        error = {
            message,
            statusCode: HTTP_STATUS_CODES.CONFLICT,
            errorCode: 'DUPLICATE_RESOURCE',
            isOperational: true,
        };
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((el) => ({
            field: el.path,
            message: el.message,
        }));
        const message = `Invalid database inputs: ${errors.map(el => el.message).join(', ')}`;
        error = {
            message,
            statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
            errorCode: 'DB_VALIDATION_ERROR',
            errors,
            isOperational: true,
        };
    }

    if (err.name === 'JsonWebTokenError') {
        error = {
            message: 'Invalid authorization token',
            statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
            errorCode: 'INVALID_TOKEN',
            isOperational: true,
        };
    }

    if (err.name === 'TokenExpiredError') {
        error = {
            message: 'Authorization token has expired',
            statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
            errorCode: 'EXPIRED_TOKEN',
            isOperational: true,
        };
    }

    const statusCode = error.statusCode || err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = error.message || err.message || 'Internal Server Error';
    const errorCode = error.errorCode || err.errorCode || 'INTERNAL_SERVER_ERROR';
    const isOperational = error.isOperational || err.isOperational || false;
    const validationErrors = error.errors || err.errors || undefined;

    if (!isOperational) {
        console.error(`[CRITICAL EXCEPTION] [ReqID: ${req.id || 'N/A'}]`, err);
    }

    const responsePayload = {
        success: false,
        message,
        errorCode,
    };

    if (validationErrors) {
        responsePayload.errors = validationErrors;
    }

    if (process.env.NODE_ENV === 'development') {
        responsePayload.stack = error.stack || err.stack;
    }

    res.status(statusCode).json(responsePayload);
};

module.exports = errorMiddleware;
