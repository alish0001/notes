const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, json } = format;
require("dotenv").config();

const logFormate = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});
const devLogger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormate
  ),
  transports: [new transports.Console()],
});

const prodLogger = createLogger({
  format: combine(timestamp(), format.errors({ stack: true }), json()),
  defaultMeta: { service: "user-service" },
  transports: [new transports.Console()],
});

module.exports =
  process.env.NODE_ENV === "development" ? devLogger : prodLogger;
