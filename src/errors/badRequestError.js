const AppError = require('./appError');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

class BadRequestError extends AppError {
    constructor(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
        super(message, HTTP_STATUS_CODES.BAD_REQUEST, errorCode);
    }
}

module.exports = BadRequestError;
