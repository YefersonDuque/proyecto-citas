const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const fileTransport = new DailyRotateFile({
  filename: "logs/proyecto-citas-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "info",
});

const errorTransport = new DailyRotateFile({
  filename: "logs/proyecto-citas-error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "error",
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console(), fileTransport, errorTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
});

module.exports = logger;
