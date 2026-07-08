const AppError = require('./appError');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
        super(message, HTTP_STATUS_CODES.FORBIDDEN, errorCode);
    }
}

module.exports = ForbiddenError;
