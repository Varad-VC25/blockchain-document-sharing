// ================================================================
// AUTH ROUTES - Authentication endpoints
// ================================================================

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validateInput");
const { authLimiter } = require("../middleware/rateLimiter");

// -- Public routes -------------------------------------------------
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);

// -- Protected routes ----------------------------------------------
router.get("/me", protect, getMe);
router.patch("/profile", protect, validateUpdateProfile, updateProfile);
router.patch("/change-password", protect, validateChangePassword, changePassword);
router.post("/logout", protect, logout);

module.exports = router;
