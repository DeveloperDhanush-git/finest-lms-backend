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

module.exports = STATUSES;
