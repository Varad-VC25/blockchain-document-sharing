const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: [true, "Document reference is required"],
    },
    documentTitle: {
      type: String,
      required: true,
    },
    ipfsCid: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
    },
    ownerWalletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    recipientWalletAddress: {
      type: String,
      required: [true, "Recipient wallet address is required"],
      lowercase: true,
    },
    recipientEmail: {
      type: String,
      default: null,
    },
    permission: {
      type: String,
      enum: ["read"],
      default: "read",
    },
    txHash: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokeTxHash: {
      type: String,
      default: null,
    },
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    message: {
      type: String,
      default: "",
      maxlength: 500,
    },
    emailNotificationSent: {
      type: Boolean,
      default: false,
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

shareSchema.index({ document: 1 });
shareSchema.index({ owner: 1 });
shareSchema.index({ recipient: 1 });
shareSchema.index({ recipientWalletAddress: 1 });
shareSchema.index({ ownerWalletAddress: 1 });
shareSchema.index({ status: 1 });
shareSchema.index({ createdAt: -1 });
shareSchema.index({ expiresAt: 1 });

shareSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

shareSchema.pre("save", function (next) {
  if (this.expiresAt && new Date() > this.expiresAt && this.status === "active") {
    this.status = "expired";
  }
  next();
});

const Share = mongoose.model("Share", shareSchema);

module.exports = Share;
