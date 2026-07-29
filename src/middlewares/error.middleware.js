const { HTTP_STATUS_CODES } = require('../constants');

const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    if (err.name === 'CastError') {
        error.message = `Invalid resource identifier format: ${err.value}`;
        error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        error.errorCode = 'INVALID_ID_FORMAT';
        error.isOperational = true;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        error.message = `Duplicate value '${value}' entered for field '${field}'. Please use another value!`;
        error.statusCode = HTTP_STATUS_CODES.CONFLICT;
        error.errorCode = 'DUPLICATE_RESOURCE';
        error.isOperational = true;
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((el) => ({
            field: el.path,
            message: el.message,
        }));
        error.message = `Invalid database inputs: ${errors.map(el => el.message).join(', ')}`;
        error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        error.errorCode = 'DB_VALIDATION_ERROR';
        error.errors = errors;
        error.isOperational = true;
    }

    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid authorization token';
        error.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        error.errorCode = 'INVALID_TOKEN';
        error.isOperational = true;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Authorization token has expired';
        error.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        error.errorCode = 'EXPIRED_TOKEN';
        error.isOperational = true;
    }

    const hasExplicitStatus = !!(error.statusCode || err.statusCode);
    const statusCode = hasExplicitStatus
        ? (error.statusCode || err.statusCode)
        : HTTP_STATUS_CODES.BAD_REQUEST;
    const message = error.message || err.message || 'Internal Server Error';
    const errorCode = error.errorCode || err.errorCode || (hasExplicitStatus ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
    const isOperational = error.isOperational || err.isOperational || !hasExplicitStatus;
    const validationErrors = error.errors || err.errors || undefined;

    const isServerError = statusCode >= 500;

    if (isServerError && !isOperational) {
        console.error(`[SERVER ERROR] [ReqID: ${req.id || 'N/A'}]`, err);
    }

    const responsePayload = {
        success: false,
        message: isServerError ? 'Internal Server Error occurred' : message,
        errorCode: isServerError ? 'INTERNAL_SERVER_ERROR' : errorCode,
    };

    if (validationErrors) {
        responsePayload.errors = validationErrors;
    }

    if (process.env.NODE_ENV === 'development') {
        responsePayload.stack = error.stack || err.stack;
        if (isServerError) {
            responsePayload.message = message;
        }
    }

    res.status(statusCode).json(responsePayload);
};

module.exports = errorMiddleware;
