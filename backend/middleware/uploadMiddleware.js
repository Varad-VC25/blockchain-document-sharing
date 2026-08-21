// ================================================================
// UPLOAD MIDDLEWARE - Multer memory storage + validation
// ================================================================

const multer = require("multer");
const path = require("path");

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "50", 10);
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
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
];

const ALLOWED_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".xls", ".xlsx",
  ".ppt", ".pptx", ".txt", ".jpg", ".jpeg",
  ".png", ".gif", ".webp",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeOk || extOk) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Unsupported file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, WEBP"
    ),
    false
  );
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

// Single file field name: "file"
const uploadSingle = upload.single("file");

// Wrapper that converts multer errors into clean JSON
const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is " + MAX_FILE_SIZE_MB + "MB",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Upload error: " + err.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload",
    });
  });
};

module.exports = {
  handleUpload,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
};
