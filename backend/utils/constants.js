// ================================================================
// CONSTANTS - Application-wide constant values
// ================================================================

const CONSTANTS = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  MESSAGES: {
    SUCCESS: "Operation completed successfully",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    FETCHED: "Data fetched successfully",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    REGISTER_SUCCESS: "Registration successful",
    TOKEN_VALID: "Token is valid",
    PASSWORD_RESET_SENT: "Password reset email sent",
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Authentication required. Please login",
    FORBIDDEN: "You do not have permission to perform this action",
    BAD_REQUEST: "Invalid request data",
    INTERNAL_ERROR: "Internal server error. Please try again later",
    VALIDATION_ERROR: "Validation failed",
    DUPLICATE_ERROR: "Resource already exists",
    RATE_LIMIT_ERROR: "Too many requests. Please try again later",
    DOCUMENT_UPLOADED: "Document uploaded and encrypted successfully",
    DOCUMENT_NOT_FOUND: "Document not found",
    DOCUMENT_ACCESS_DENIED: "Access denied. You do not have permission to access this document",
    DOCUMENT_SHARED: "Document shared successfully",
    DOCUMENT_REVOKED: "Document access revoked successfully",
    DOCUMENT_INTEGRITY_FAILED: "Document integrity verification failed. File may be corrupted or tampered",
    DOCUMENT_INTEGRITY_PASSED: "Document integrity verified successfully",
    WALLET_CONNECTED: "Wallet connected successfully",
    WALLET_NOT_CONNECTED: "No wallet connected",
    WALLET_MISMATCH: "Wallet address does not match",
  },

  FILE_UPLOAD: {
    MAX_SIZE_BYTES: 50 * 1024 * 1024,
    ALLOWED_MIME_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    ALLOWED_EXTENSIONS: [
      ".pdf", ".doc", ".docx", ".xls", ".xlsx",
      ".ppt", ".pptx", ".txt", ".jpg", ".jpeg",
      ".png", ".gif", ".webp"
    ],
    UPLOAD_DIR: "uploads/",
  },

  JWT: {
    EXPIRES_IN: "7d",
    ALGORITHM: "HS256",
  },

  ENCRYPTION: {
    ALGORITHM: "aes-256-cbc",
    IV_LENGTH: 16,
    KEY_LENGTH: 32,
    HASH_ALGORITHM: "sha256",
  },

  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 10,
    UPLOAD_MAX_REQUESTS: 20,
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  AUDIT_ACTIONS: {
    UPLOAD: "UPLOAD",
    DOWNLOAD: "DOWNLOAD",
    SHARE: "SHARE",
    REVOKE: "REVOKE",
    VERIFY: "VERIFY",
    DELETE: "DELETE",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    REGISTER: "REGISTER",
    UPDATE: "UPDATE",
  },

  ROLES: {
    USER: "user",
    ADMIN: "admin",
  },

  PERMISSIONS: {
    READ: "read",
    WRITE: "write",
  },

  BLOCKCHAIN: {
    NETWORKS: {
      SEPOLIA: "sepolia",
      LOCALHOST: "localhost",
    },
    SEPOLIA_CHAIN_ID: 11155111,
    LOCALHOST_CHAIN_ID: 31337,
  },
};

module.exports = CONSTANTS;
