const winston = require("winston");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = "[" + timestamp + "] [" + level.toUpperCase() + "]: " + message;
    if (stack) log += "\n" + stack;
    if (Object.keys(meta).length > 0) log += "\n" + JSON.stringify(meta, null, 2);
    return log;
  })
);

const colorizedFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  logFormat
);

const transports = [
  new winston.transports.Console({
    format: colorizedFormat,
    silent: process.env.NODE_ENV === "test",
  }),
];

if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format: logFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format: logFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  format: logFormat,
  transports,
  exitOnError: false,
});

morgan.token("user-id", (req) => {
  return req.user ? req.user.id : "anonymous";
});

const morganFormat =
  process.env.NODE_ENV === "development"
    ? ":method :url :status :response-time ms - :res[content-length]"
    : ":remote-addr - :user-id [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length]";

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    },
  },
});

module.exports = { logger, morganMiddleware };
