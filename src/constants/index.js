const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
};

const STATUSES = {
    ACCOUNT: {
        ACTIVE: 'active',
        SUSPENDED: 'suspended',
        BLOCKED: 'blocked',
        DELETED: 'deleted',
    },
    ENROLLMENT: {
        ACTIVE: 'active',
        COMPLETED: 'completed',
        PENDING: 'pending',
    },
    COURSE: {
        DRAFT: 'draft',
        PUBLISHED: 'published',
    },
    PAYMENT: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
        REFUNDED: 'refunded',
    },
};

module.exports = {
    HTTP_STATUS_CODES,
    STATUSES,
};
