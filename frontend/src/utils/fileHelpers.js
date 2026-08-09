// ================================================================
// FILE HELPERS - File utility functions
// ================================================================

import {
  FiFileText, FiImage, FiFilm, FiMusic, FiArchive,
  FiFile, FiCode, FiDatabase
} from "react-icons/fi";

// Get file icon based on MIME type or extension
export const getFileIcon = (mimeType, fileName) => {
  const ext = fileName ? fileName.split(".").pop().toLowerCase() : "";
  const type = (mimeType || "").toLowerCase();

  if (type.startsWith("image/")) return FiImage;
  if (type.startsWith("video/")) return FiFilm;
  if (type.startsWith("audio/")) return FiMusic;
  if (type.includes("pdf")) return FiFileText;
  if (type.includes("word") || ext === "doc" || ext === "docx") return FiFileText;
  if (type.includes("sheet") || ext === "xls" || ext === "xlsx") return FiDatabase;
  if (type.includes("presentation") || ext === "ppt" || ext === "pptx") return FiFileText;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return FiArchive;
  if (["js", "html", "css", "json", "xml", "py", "java", "cpp"].includes(ext)) return FiCode;
  if (type === "text/plain" || ext === "txt") return FiFileText;

  return FiFile;
};

// Get file category
export const getFileCategory = (mimeType, fileName) => {
  const type = (mimeType || "").toLowerCase();
  const ext = fileName ? fileName.split(".").pop().toLowerCase() : "";

  if (type.startsWith("image/")) return "image";
  if (type.includes("sheet") || ["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (type.includes("presentation") || ["ppt", "pptx"].includes(ext)) return "presentation";
  if (type.includes("pdf") || type.includes("word") || ["pdf", "doc", "docx", "txt"].includes(ext)) return "document";
  return "other";
};

// Get color for file type
export const getFileColor = (mimeType, fileName) => {
  const type = (mimeType || "").toLowerCase();
  const ext = fileName ? fileName.split(".").pop().toLowerCase() : "";

  if (type.startsWith("image/")) return "from-purple-500 to-pink-500";
  if (type.startsWith("video/")) return "from-red-500 to-orange-500";
  if (type.includes("pdf")) return "from-red-500 to-red-600";
  if (type.includes("word") || ["doc", "docx"].includes(ext)) return "from-blue-500 to-blue-600";
  if (type.includes("sheet") || ["xls", "xlsx"].includes(ext)) return "from-green-500 to-emerald-600";
  if (type.includes("presentation") || ["ppt", "pptx"].includes(ext)) return "from-orange-500 to-red-500";
  return "from-gray-500 to-gray-600";
};

// Validate file
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024,
    allowedTypes = null,
    allowedExtensions = null,
  } = options;

  const errors = [];

  if (!file) {
    errors.push("No file provided");
    return { valid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push("File size exceeds " + (maxSize / (1024 * 1024)) + "MB limit");
  }

  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      errors.push("File type not allowed: " + file.type);
    }
  }

  if (allowedExtensions && allowedExtensions.length > 0) {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      errors.push("File extension not allowed: " + ext);
    }
  }

  return { valid: errors.length === 0, errors };
};

// Read file as ArrayBuffer (for encryption in Module 10)
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Read file as Data URL (for previews)
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// Default allowed file settings
export const DEFAULT_FILE_SETTINGS = {
  maxSize: 50 * 1024 * 1024,
  allowedExtensions: [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".ppt", ".pptx", ".txt", ".jpg", ".jpeg",
    ".png", ".gif", ".webp"
  ],
};
