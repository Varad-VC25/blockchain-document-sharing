// ================================================================
// RESPONSE HELPER - Standardized API response functions
// ================================================================

const { logger } = require("./logger");

const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = "Error", error = null) => {
  logger.error("API Error " + statusCode + ": " + message, { error });
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (error !== null && process.env.NODE_ENV === "development") {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, data, page, limit, total, message = "Data fetched successfully") => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    timestamp: new Date().toISOString(),
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
    },
  });
};

const sendCreated = (res, message = "Created successfully", data = null) => {
  return sendSuccess(res, 201, message, data);
};

const sendNotFound = (res, message = "Resource not found") => {
  return sendError(res, 404, message);
};

const sendUnauthorized = (res, message = "Authentication required") => {
  return sendError(res, 401, message);
};

const sendForbidden = (res, message = "Access denied") => {
  return sendError(res, 403, message);
};

const sendValidationError = (res, message = "Validation failed", errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(422).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendValidationError,
};
