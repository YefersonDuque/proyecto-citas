const winston = require("winston");

const DailyRotateFile = require("winston-daily-rotate-file");

const fileTransport = new DailyRotateFile({
  filename: "logs/proyecto-citas-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "info",
  utc: false,
});

const errorTransport = new DailyRotateFile({
  filename: "logs/proyecto-citas-error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "error",
  utc: false,
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console(), fileTransport, errorTransport],
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => {
        return new Date().toLocaleString("sv-SE", {
          timeZone: "America/Bogota",
        });
      },
    }),
    winston.format.simple(),
  ),
});

module.exports = logger;
