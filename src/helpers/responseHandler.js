const { HTTP_STATUS_CODES } = require('../constants');

const sendResponse = (res, { statusCode = HTTP_STATUS_CODES.OK, success = true, message = '', data = null, meta = null } = {}) => {
    const payload = {
        success,
        message,
    };

    if (data !== null && data !== undefined) {
        payload.data = data;
    }

    if (meta !== null && meta !== undefined) {
        payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
};

const success = (res, message = 'Success', data = null, meta = null, statusCode = HTTP_STATUS_CODES.OK) => {
    return sendResponse(res, {
        statusCode,
        success: true,
        message,
        data,
        meta,
    });
};

const created = (res, message = 'Created successfully', data = null, meta = null) => {
    return sendResponse(res, {
        statusCode: HTTP_STATUS_CODES.CREATED,
        success: true,
        message,
        data,
        meta,
    });
};

module.exports = {
    sendResponse,
    success,
    created,
};
