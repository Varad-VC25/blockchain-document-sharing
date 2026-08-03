// ================================================================
// SERVER.JS - Main Express Application Entry Point
// ================================================================
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");

const { logger, morganMiddleware } = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn("CORS blocked request from: " + origin);
      callback(new Error("Not allowed by CORS policy"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
};
app.use(cors(corsOptions));

app.use("/api", generalLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(mongoSanitize());
app.use(hpp());
app.use(compression());
app.use(morganMiddleware);

if (NODE_ENV === "development") {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blockchain Document Sharing API is running",
    version: "1.0.0",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /api/health",
      auth: "/api/auth",
      documents: "/api/documents",
      share: "/api/share",
      audit: "/api/audit",
      user: "/api/user",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime() + " seconds",
    memory: process.memoryUsage(),
    environment: NODE_ENV,
  });
});

// Routes - uncommented as modules are built
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/documents", require("./routes/documentRoutes"));
// app.use("/api/share", require("./routes/shareRoutes"));
// app.use("/api/audit", require("./routes/auditRoutes"));
// app.use("/api/user", require("./routes/userRoutes"));

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      logger.info("================================================");
      logger.info(" Blockchain Document Sharing API");
      logger.info("================================================");
      logger.info("Environment : " + NODE_ENV);
      logger.info("Server URL  : http://localhost:" + PORT);
      logger.info("Health Check: http://localhost:" + PORT + "/api/health");
      logger.info("================================================");
      logger.info("MongoDB     : Not connected yet (Module 3)");
      logger.info("Blockchain  : Not connected yet (Module 7)");
      logger.info("================================================");
    });

    const gracefulShutdown = (signal) => {
      logger.info(signal + " received. Starting graceful shutdown...");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Promise Rejection", {
        reason: reason && reason.message ? reason.message : reason,
      });
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception - shutting down", {
        message: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

  } catch (error) {
    logger.error("Failed to start server", { message: error.message });
    process.exit(1);
  }
};

startServer();

module.exports = app;
