const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()} : ${message}`;
        })
    ),

    transports: [

        new winston.transports.File({
            filename: path.join(logDir, 'app.log')
        }),

        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),

        new winston.transports.Console()

    ]
});

module.exports = logger;