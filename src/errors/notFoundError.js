const AppError = require('./appError');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

class NotFoundError extends AppError {
    constructor(message = 'Resource Not Found', errorCode = 'NOT_FOUND') {
        super(message, HTTP_STATUS_CODES.NOT_FOUND, errorCode);
    }
}

module.exports = NotFoundError;
