const MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: 'Registration successful',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        UNAUTHORIZED: 'You are not authorized to access this resource',
        FORBIDDEN: 'Action forbidden. You do not have permission',
        TOKEN_INVALID: 'Invalid token, authorization denied',
        TOKEN_EXPIRED: 'Token expired',
        CREDENTIALS_INVALID: 'Invalid email or password',
    },
    DATABASE: {
        CONNECT_SUCCESS: 'Database connected successfully',
        CONNECT_ERROR: 'Database connection failed',
    },
    COMMON: {
        NOT_FOUND: 'Resource not found',
        BAD_REQUEST: 'Invalid request data',
        SERVER_ERROR: 'Internal server error occurred',
        SUCCESS: 'Success',
    },
};

module.exports = MESSAGES;
