const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  deleteDocument,
  getIpfsStatus,
  getCloudStorageAnalytics,
  registerOnBlockchain,
} = require("../controllers/documentController");

const { protect } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const { uploadLimiter } = require("../middleware/rateLimiter");

router.use(protect);

// status routes first (before :id)
router.get("/ipfs/status", getIpfsStatus);
router.get("/cloud/status", getCloudStorageAnalytics);

router.get("/", getMyDocuments);
router.post("/upload", uploadLimiter, handleUpload, uploadDocument);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);
router.patch("/:id/blockchain", registerOnBlockchain);

module.exports = router;
