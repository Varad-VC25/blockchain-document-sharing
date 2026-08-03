const rateLimit = require("express-rate-limit");
const { logger } = require("../utils/logger");

const rateLimitHandler = (req, res, next, options) => {
  logger.warn("Rate limit exceeded", {
    ip: req.ip,
    path: req.path,
    method: req.method,
  });

  return res.status(429).json({
    success: false,
    message: "Too many requests. Please wait and try again later",
    retryAfter: Math.ceil(options.windowMs / 1000 / 60) + " minutes",
    timestamp: new Date().toISOString(),
  });
};

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => {
    const trustedIPs = ["127.0.0.1", "::1"];
    return trustedIPs.includes(req.ip) && process.env.NODE_ENV === "development";
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => process.env.NODE_ENV === "development",
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Too many upload requests",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Too many download requests",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { generalLimiter, authLimiter, uploadLimiter, downloadLimiter };
