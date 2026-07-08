const AppError = require('./appError');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
        super(message, HTTP_STATUS_CODES.UNAUTHORIZED, errorCode);
    }
}

module.exports = UnauthorizedError;
