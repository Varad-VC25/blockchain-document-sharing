const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user.id : "unauthenticated",
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = field.charAt(0).toUpperCase() + field.slice(1) + " already exists";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid " + err.path + ": " + err.value;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired. Please login again";
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size too large. Maximum allowed size is 50MB";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected file field in upload";
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.errorName = err.name;
  }

  return res.status(statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new Error("Route not found: " + req.method + " " + req.originalUrl);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
