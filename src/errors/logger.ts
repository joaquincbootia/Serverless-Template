import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
	level: 'info',
	format: format.combine(format.timestamp(), format.errors({ stack: true }), customFormat),
	transports: [new transports.Console()]
});

export default logger;
