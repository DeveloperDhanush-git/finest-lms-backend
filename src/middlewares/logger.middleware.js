const logger = require("../config/logger");

const loggerMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const duration =
            Number(process.hrtime.bigint() - start) / 1_000_000;

        logger.info("HTTP Request", {
            requestId: req.id,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration.toFixed(2)} ms`,
            ip: req.ip,
            userId: req.user?._id || null,
            role: req.user?.role || null,
            userAgent: req.get("User-Agent"),
        });
    });

    next();
};

module.exports = loggerMiddleware;