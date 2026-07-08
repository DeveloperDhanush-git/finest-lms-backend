const AppError = require('./appError');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

class ConflictError extends AppError {
    constructor(message = 'Resource Conflict', errorCode = 'CONFLICT') {
        super(message, HTTP_STATUS_CODES.CONFLICT, errorCode);
    }
}

module.exports = ConflictError;
