const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema(
  {
    versionNumber: { type: Number, required: true },
    ipfsCid: { type: String, required: true },
    fileHash: { type: String, required: true },
    encryptedHash: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    txHash: { type: String, default: null },
    notes: { type: String, default: "", maxlength: 500 },
  },
  { _id: true }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    originalFileName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true,
    },
    encryptedFileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
    },
    fileExtension: {
      type: String,
      required: true,
      lowercase: true,
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: 1,
    },
    ipfsCid: {
      type: String,
      required: [true, "IPFS CID is required"],
      unique: true,
    },
    ipfsUrl: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      default: null,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    fileHash: {
      type: String,
      required: [true, "File hash is required"],
    },
    encryptedHash: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      default: null,
    },
    isOnBlockchain: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Document owner is required"],
    },
    ownerWalletAddress: {
      type: String,
      required: [true, "Owner wallet address is required"],
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["document", "image", "spreadsheet", "presentation", "other"],
      default: "document",
    },
    sharedWith: [
      {
        walletAddress: { type: String, lowercase: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["read"], default: "read" },
        sharedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: null },
      },
    ],
    currentVersion: {
      type: Number,
      default: 1,
    },
    versions: {
      type: [versionSchema],
      default: [],
    },
    aiSummary: {
      summary: { type: String, default: null },
      keywords: { type: [String], default: [] },
      importantPoints: { type: [String], default: [] },
      generatedAt: { type: Date, default: null },
    },
    ocrText: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
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

documentSchema.index({ owner: 1 });
documentSchema.index({ fileHash: 1 });
documentSchema.index({ ownerWalletAddress: 1 });
documentSchema.index({ createdAt: -1 });
documentSchema.index({ isDeleted: 1 });

documentSchema.virtual("fileSizeFormatted").get(function () {
  const bytes = this.fileSize;
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
});

documentSchema.virtual("isShared").get(function () {
  return this.sharedWith && this.sharedWith.length > 0;
});

documentSchema.pre(/^find/, function () {
  if (!this.getQuery().isDeleted) {
    this.where({ isDeleted: false });
  }
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
