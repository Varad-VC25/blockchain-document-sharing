require("dotenv").config();
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 15000,
  heartbeatFrequencyMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const sanitizedURI = mongoURI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://***:***@"
    );
    logger.info("Connecting to MongoDB: " + sanitizedURI);
    const connection = await mongoose.connect(mongoURI, connectionOptions);
    logger.info("================================================");
    logger.info("MongoDB Connected Successfully");
    logger.info("Host     : " + connection.connection.host);
    logger.info("Database : " + connection.connection.name);
    logger.info("================================================");
    return connection;
  } catch (error) {
    logger.error("MongoDB Connection Failed: " + error.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB");
});
mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected from MongoDB");
});
mongoose.connection.on("error", (error) => {
  logger.error("Mongoose connection error: " + error.message);
});
mongoose.connection.on("reconnected", () => {
  logger.info("Mongoose reconnected to MongoDB");
});

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed gracefully");
  } catch (error) {
    logger.error("Error closing MongoDB connection: " + error.message);
  }
};

const getConnectionStatus = () => {
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  return states[mongoose.connection.readyState] || "Unknown";
};

module.exports = { connectDB, disconnectDB, getConnectionStatus };
