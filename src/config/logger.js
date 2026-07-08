const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",

    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),

    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}] ${message} ${
                        Object.keys(meta).length ? JSON.stringify(meta) : ""
                    }`;
                })
            ),
        }),

        new transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        new transports.File({
            filename: "logs/combined.log",
        }),
    ],
});

module.exports = logger;