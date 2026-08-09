const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Action type is required"],
      enum: [
        "UPLOAD", "DOWNLOAD", "SHARE", "REVOKE", "VERIFY",
        "DELETE", "LOGIN", "LOGOUT", "REGISTER", "UPDATE",
        "VIEW", "WALLET_CONNECT", "WALLET_DISCONNECT"
      ],
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "SUCCESS",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userEmail: { type: String, default: null },
    walletAddress: { type: String, default: null, lowercase: true },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    documentTitle: { type: String, default: null },
    ipfsCid: { type: String, default: null },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetWalletAddress: { type: String, default: null, lowercase: true },
    txHash: { type: String, default: null },
    blockNumber: { type: Number, default: null },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    errorMessage: { type: String, default: null },
    description: {
      type: String,
      required: [true, "Audit log description is required"],
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ document: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ walletAddress: 1 });

auditLogSchema.statics.createLog = async function (logData) {
  try {
    const log = await this.create(logData);
    return log;
  } catch (error) {
    console.error("Failed to create audit log:", error.message);
    return null;
  }
};

auditLogSchema.statics.getUserLogs = function (userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

auditLogSchema.statics.getDocumentLogs = function (documentId, limit = 50) {
  return this.find({ document: documentId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
