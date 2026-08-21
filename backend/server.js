require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const hpp = require("hpp");
const path = require("path");
const mongoose = require("mongoose");

const { logger, morganMiddleware } = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");
const { connectDB, disconnectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// -- Security & Middleware -----------------------------------------
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

// -- Parsers -------------------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(hpp());
app.use(compression());
app.use(morganMiddleware);

// -- Static Files (development) -----------------------------------
if (NODE_ENV === "development") {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

// -- Root & Health Check -------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blockchain Document Sharing API is running",
    version: "1.0.0",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  const dbStates = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime() + " seconds",
    environment: NODE_ENV,
    database: dbStates[mongoose.connection.readyState] || "Unknown",
  });
});

// -- API Routes (REGISTERED HERE BEFORE ERROR HANDLERS) ------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));

// -- Error Handling (MUST BE AFTER ROUTES) -------------------------
app.use(notFoundHandler);
app.use(errorHandler);

// -- Start Server --------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info("================================================");
      logger.info(" Blockchain Document Sharing API");
      logger.info("================================================");
      logger.info("Environment  : " + NODE_ENV);
      logger.info("Server URL   : http://localhost:" + PORT);
      logger.info("Health Check : http://localhost:" + PORT + "/api/health");
      logger.info("Auth API     : http://localhost:" + PORT + "/api/auth");
      logger.info("Documents API: http://localhost:" + PORT + "/api/documents");
      logger.info("================================================");
    });

    const gracefulShutdown = async (signal) => {
      logger.info(signal + " received. Starting graceful shutdown...");
      await disconnectDB();
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
      logger.error("Unhandled Rejection: " + (reason && reason.message ? reason.message : reason));
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception: " + error.message);
      process.exit(1);
    });

  } catch (error) {
    logger.error("Failed to start server: " + error.message);
    process.exit(1);
  }
};

startServer();
module.exports = app;
