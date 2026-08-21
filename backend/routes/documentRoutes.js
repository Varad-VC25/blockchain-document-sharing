// ================================================================
// DOCUMENT ROUTES
// ================================================================

const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  deleteDocument,
  getIpfsStatus,
} = require("../controllers/documentController");

const { protect } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const { uploadLimiter } = require("../middleware/rateLimiter");

// All document routes require login
router.use(protect);

// IPFS status
router.get("/ipfs/status", getIpfsStatus);

// List my documents
router.get("/", getMyDocuments);

// Upload encrypted document to IPFS
router.post("/upload", uploadLimiter, handleUpload, uploadDocument);

// Get one document
router.get("/:id", getDocumentById);

// Soft delete
router.delete("/:id", deleteDocument);

module.exports = router;
