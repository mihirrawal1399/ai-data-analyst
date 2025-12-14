import pino from 'pino';

const logLevel = process.env.WORKER_LOG_LEVEL || 'info';

export const logger = pino({
    level: logLevel,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
        },
    },
});
