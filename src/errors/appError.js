const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

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

module.exports = AppError;
