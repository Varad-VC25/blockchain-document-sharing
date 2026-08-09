// ================================================================
// AUTH MIDDLEWARE - JWT verification middleware
// ================================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logger } = require("../utils/logger");

// -- Protect routes - require valid JWT token ----------------------
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Token may be invalid",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account has been deactivated. Please contact support",
        });
      }

      // Attach user to request object
      req.user = user;
      next();

    } catch (error) {
      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please login again",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again",
        });
      }

      throw error;
    }
  } catch (error) {
    logger.error("Auth middleware error: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// -- Restrict access to specific roles -----------------------------
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

// -- Optional auth - Attach user if token present, else continue --
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (err) {
        // Silently fail - user just won't be authenticated
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, restrictTo, optionalAuth };
