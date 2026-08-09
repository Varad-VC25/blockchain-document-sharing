// ================================================================
// VALIDATE INPUT MIDDLEWARE - Handle express-validator results
// ================================================================

const { body, validationResult } = require("express-validator");

// -- Handle validation errors --------------------------------------
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// -- Register validation rules -------------------------------------
const validateRegister = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  handleValidation,
];

// -- Login validation rules ----------------------------------------
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidation,
];

// -- Update profile validation -------------------------------------
const validateUpdateProfile = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),

  body("walletAddress")
    .optional()
    .trim()
    .matches(/^(0x)?[0-9a-fA-F]{40}$/).withMessage("Please provide a valid Ethereum wallet address"),

  handleValidation,
];

// -- Change password validation ------------------------------------
const validateChangePassword = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  handleValidation,
};
