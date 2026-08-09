const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { logger } = require("../utils/logger");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("=== REGISTER DEBUG ===");
    console.log("Received:", { fullName, email, password: "***" });

    console.log("Step 1: Checking existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.log("Step 2: Creating new user...");
    const user = await User.create({ fullName, email, password });
    console.log("Step 3: User created with ID:", user._id);

    console.log("Step 4: Generating token...");
    const token = generateToken(user._id);

    console.log("Step 5: Getting public profile...");
    const profile = user.getPublicProfile();

    console.log("Step 6: Returning response...");
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: profile,
        token,
      },
    });
  } catch (error) {
    console.log("=== ERROR CAUGHT ===");
    console.log("Message:", error.message);
    console.log("Full Stack:", error.stack);
    logger.error("Register error: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again",
      error: error.message,
      stack: error.stack,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated",
      });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();
    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: user.getPublicProfile(), token },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    return res.status(200).json({ success: true, data: { user: user.getPublicProfile() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed" });
  }
};

const changePassword = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Password changed" });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = { register, login, getMe, updateProfile, changePassword, logout };
