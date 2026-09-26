const path = require("path");
const Document = require("../models/Document");
const AuditLog = require("../models/AuditLog");
const { encryptBuffer } = require("../services/encryptionService");
const { generateHash } = require("../services/hashService");
const { uploadToIPFS, unpinFromIPFS } = require("../services/ipfsService");
const {
  uploadEncryptedBackup,
  deleteEncryptedBackup,
  getCloudinaryStatus,
} = require("../services/cloudinaryService");
const { logger } = require("../utils/logger");

const detectCategory = (mimeType = "", fileName = "") => {
  const type = mimeType.toLowerCase();
  const ext = path.extname(fileName).toLowerCase();
  if (type.startsWith("image/") || [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return "image";
  if (type.includes("sheet") || [".xls", ".xlsx", ".csv"].includes(ext)) return "spreadsheet";
  if (type.includes("presentation") || [".ppt", ".pptx"].includes(ext)) return "presentation";
  if (type.includes("pdf") || type.includes("word") || type.includes("text") || [".pdf", ".doc", ".docx", ".txt"].includes(ext)) return "document";
  return "other";
};

const parseTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) {
    return tagsInput.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 10);
  }
  return String(tagsInput)
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);
};

// POST /api/documents/upload
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use form field name: file",
      });
    }

    const user = req.user;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype || "application/octet-stream";
    const originalBuffer = req.file.buffer;
    const ext = path.extname(originalName).toLowerCase() || "";

    const title = (req.body.title || originalName.replace(ext, "") || "Untitled").trim();
    const description = (req.body.description || "").trim();
    const category = req.body.category || detectCategory(mimeType, originalName);
    const tags = parseTags(req.body.tags);

    // 1) Hash original
    const fileHash = generateHash(originalBuffer);

    // 2) Encrypt
    const encrypted = encryptBuffer(originalBuffer);
    const encryptedBuffer = encrypted.encryptedBuffer;

    // 3) Hash encrypted
    const encryptedHash = generateHash(encryptedBuffer);

    // 4) IPFS primary
    const safeName = "encrypted_" + Date.now() + ext + ".bin";
    const ipfs = await uploadToIPFS(encryptedBuffer, safeName, {
      owner: String(user._id),
      originalName: originalName.substring(0, 100),
    });

    // 5) Cloudinary encrypted backup
    const cloudBackup = await uploadEncryptedBackup(encryptedBuffer, safeName);

    const ownerWallet =
      (user.walletAddress && String(user.walletAddress).toLowerCase()) ||
      "0x0000000000000000000000000000000000000000";

    // 6) Save MongoDB
    const doc = await Document.create({
      title,
      description,
      originalFileName: originalName,
      encryptedFileName: safeName,
      mimeType,
      fileExtension: ext || ".bin",
      fileSize: originalBuffer.length,
      ipfsCid: ipfs.cid,
      ipfsUrl: ipfs.ipfsUrl,
      cloudinaryUrl: cloudBackup.url || null,
      cloudinaryPublicId: cloudBackup.publicId || null,
      fileHash,
      encryptedHash,
      txHash: null,
      isOnBlockchain: false,
      owner: user._id,
      ownerWalletAddress: ownerWallet,
      tags,
      category,
      sharedWith: [],
      currentVersion: 1,
      versions: [
        {
          versionNumber: 1,
          ipfsCid: ipfs.cid,
          fileHash,
          encryptedHash,
          fileSize: originalBuffer.length,
          uploadedAt: new Date(),
          uploadedBy: user._id,
          txHash: null,
          notes: "Initial upload with encrypted cloud backup",
        },
      ],
      downloadCount: 0,
      viewCount: 0,
    });

    try {
      user.stats = user.stats || {};
      user.stats.totalUploads = (user.stats.totalUploads || 0) + 1;
      user.stats.storageUsed = (user.stats.storageUsed || 0) + originalBuffer.length;
      await user.save();
    } catch (e) {
      logger.warn("Failed to update user stats: " + e.message);
    }

    try {
      await AuditLog.createLog({
        action: "UPLOAD",
        status: "SUCCESS",
        user: user._id,
        userEmail: user.email,
        walletAddress: ownerWallet,
        document: doc._id,
        documentTitle: doc.title,
        ipfsCid: doc.ipfsCid,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        description: "Document uploaded to IPFS + Cloudinary backup: " + doc.title,
        details: {
          cid: doc.ipfsCid,
          cloudBackup: !!doc.cloudinaryUrl,
        },
      });
    } catch (e) {}

    return res.status(201).json({
      success: true,
      message: cloudBackup.success
        ? "Document encrypted, uploaded to IPFS, and backed up to Cloudinary"
        : "Document encrypted and uploaded to IPFS (cloud backup skipped/failed)",
      data: {
        document: doc,
        storage: {
          ipfs: {
            cid: ipfs.cid,
            url: ipfs.ipfsUrl,
          },
          cloudinary: {
            backedUp: !!cloudBackup.success,
            url: cloudBackup.url || null,
            publicId: cloudBackup.publicId || null,
            message: cloudBackup.message || null,
          },
        },
        crypto: {
          algorithm: encrypted.algorithm,
          fileHash,
          encryptedHash,
        },
      },
    });
  } catch (error) {
    logger.error("Upload document failed: " + error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Document upload failed",
    });
  }
};

// GET /api/documents
const getMyDocuments = async (req, res) => {
  try {
    const { search = "", category = "all", sort = "newest" } = req.query;
    const filter = { owner: req.user._id, isDeleted: false };

    if (category && category !== "all") filter.category = category;

    if (search && String(search).trim() !== "") {
      const q = String(search).trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { originalFileName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "name") sortOption = { title: 1 };
    if (sort === "name-desc") sortOption = { title: -1 };
    if (sort === "size") sortOption = { fileSize: -1 };
    if (sort === "size-asc") sortOption = { fileSize: 1 };

    const documents = await Document.find(filter).sort(sortOption).lean();

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: { documents, count: documents.length },
    });
  } catch (error) {
    logger.error("Get documents failed: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

// GET /api/documents/:id
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    doc.viewCount = (doc.viewCount || 0) + 1;
    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: { document: doc },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch document" });
  }
};

// DELETE /api/documents/:id
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    doc.isDeleted = true;
    doc.deletedAt = new Date();
    await doc.save();

    if (doc.ipfsCid) await unpinFromIPFS(doc.ipfsCid);
    if (doc.cloudinaryPublicId) await deleteEncryptedBackup(doc.cloudinaryPublicId);

    try {
      await AuditLog.createLog({
        action: "DELETE",
        status: "SUCCESS",
        user: req.user._id,
        userEmail: req.user.email,
        document: doc._id,
        documentTitle: doc.title,
        ipfsCid: doc.ipfsCid,
        description: "Document deleted from IPFS and Cloudinary: " + doc.title,
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete document" });
  }
};

// GET /api/documents/ipfs/status
const getIpfsStatus = async (req, res) => {
  try {
    const { testPinataConnection } = require("../services/ipfsService");
    const result = await testPinataConnection();
    return res.status(result.success ? 200 : 503).json({
      success: result.success,
      message: result.message,
      provider: "pinata",
      gateway: process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/",
    });
  } catch (error) {
    return res.status(503).json({ success: false, message: error.message });
  }
};

// GET /api/documents/cloud/status
const getCloudStorageAnalytics = async (req, res) => {
  try {
    const status = await getCloudinaryStatus();
    const docs = await Document.find({ owner: req.user._id, isDeleted: false }).lean();

    const totalDocuments = docs.length;
    const backedUpDocuments = docs.filter((d) => !!d.cloudinaryUrl).length;
    const totalStorageBytes = docs.reduce((sum, d) => sum + (d.fileSize || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        service: status,
        stats: {
          totalDocuments,
          backedUpDocuments,
          backupPercentage:
            totalDocuments > 0 ? Math.round((backedUpDocuments / totalDocuments) * 100) : 100,
          totalStorageBytes,
        },
        documents: docs.map((d) => ({
          id: d._id,
          title: d.title,
          fileName: d.originalFileName,
          fileSize: d.fileSize,
          ipfsCid: d.ipfsCid,
          hasCloudBackup: !!d.cloudinaryUrl,
          cloudinaryUrl: d.cloudinaryUrl,
          createdAt: d.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load cloud analytics",
    });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  deleteDocument,
  getIpfsStatus,
  getCloudStorageAnalytics,
};
