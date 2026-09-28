// ================================================================
// SHARE CONTROLLER - Updated for Dual Wallet & Email Resolution
// ================================================================

const Document = require("../models/Document");
const Share = require("../models/Share");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { logger } = require("../utils/logger");

// POST /api/share/resolve-recipient
// Body: { recipient } (email or wallet)
const resolveRecipient = async (req, res) => {
  try {
    const { recipient } = req.body;
    if (!recipient) {
      return res.status(400).json({ success: false, message: "Recipient is required" });
    }

    const input = recipient.trim().toLowerCase();
    const isWallet = /^0x[a-f0-9]{40}$/i.test(input);

    if (isWallet) {
      const user = await User.findOne({ walletAddress: input });
      return res.status(200).json({
        success: true,
        data: {
          type: "wallet",
          walletAddress: input,
          userExists: !!user,
          userName: user ? user.fullName : null,
          userEmail: user ? user.email : null,
        },
      });
    } else {
      // Input is an email
      const user = await User.findOne({ email: input });
      return res.status(200).json({
        success: true,
        data: {
          type: "email",
          userEmail: input,
          userExists: !!user,
          userName: user ? user.fullName : null,
          walletAddress: user && user.walletAddress ? user.walletAddress.toLowerCase() : null,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/share/grant
// Body: { documentId, recipientWalletAddress, recipientEmail, expiresAt, message, txHash }
const grantShareAccess = async (req, res) => {
  try {
    const { documentId, recipientWalletAddress, recipientEmail, expiresAt, message, txHash } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, message: "documentId is required" });
    }
    if (!recipientWalletAddress && !recipientEmail) {
      return res.status(400).json({ success: false, message: "Recipient wallet address or email is required" });
    }

    const doc = await Document.findOne({ _id: documentId, owner: req.user._id, isDeleted: false });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found or you are not the owner" });
    }

    let targetWallet = recipientWalletAddress ? recipientWalletAddress.trim().toLowerCase() : null;
    let targetEmail = recipientEmail ? recipientEmail.trim().toLowerCase() : null;
    let targetUser = null;

    // Look up user by email or wallet
    if (targetEmail) {
      targetUser = await User.findOne({ email: targetEmail });
      if (targetUser && targetUser.walletAddress && !targetWallet) {
        targetWallet = targetUser.walletAddress.toLowerCase();
      }
    } else if (targetWallet) {
      targetUser = await User.findOne({ walletAddress: targetWallet });
      if (targetUser) targetEmail = targetUser.email;
    }

    // Prevent sharing with self
    if (targetWallet && targetWallet === String(doc.ownerWalletAddress).toLowerCase()) {
      return res.status(400).json({ success: false, message: "You cannot share a document with yourself" });
    }
    if (targetEmail && targetEmail === String(req.user.email).toLowerCase()) {
      return res.status(400).json({ success: false, message: "You cannot share a document with yourself" });
    }

    // Save or update Share record in MongoDB
    const share = await Share.findOneAndUpdate(
      {
        document: doc._id,
        $or: [
          ...(targetWallet ? [{ recipientWalletAddress: targetWallet }] : []),
          ...(targetEmail ? [{ recipientEmail: targetEmail }] : []),
        ],
      },
      {
        document: doc._id,
        documentTitle: doc.title,
        ipfsCid: doc.ipfsCid,
        owner: req.user._id,
        ownerWalletAddress: doc.ownerWalletAddress,
        recipient: targetUser ? targetUser._id : null,
        recipientWalletAddress: targetWallet || "pending_wallet",
        recipientEmail: targetEmail || (targetUser ? targetUser.email : null),
        permission: "read",
        txHash: txHash || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "active",
        message: message || "",
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    // Update document sharedWith array if targetWallet exists
    if (targetWallet) {
      const existingShared = doc.sharedWith.find(s => String(s.walletAddress).toLowerCase() === targetWallet);
      if (!existingShared) {
        doc.sharedWith.push({
          walletAddress: targetWallet,
          userId: targetUser ? targetUser._id : null,
          permission: "read",
          sharedAt: new Date(),
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        });
        await doc.save();
      }
    }

    // Update statistics
    try {
      req.user.stats = req.user.stats || {};
      req.user.stats.totalShared = (req.user.stats.totalShared || 0) + 1;
      await req.user.save();

      if (targetUser) {
        targetUser.stats = targetUser.stats || {};
        targetUser.stats.totalReceived = (targetUser.stats.totalReceived || 0) + 1;
        await targetUser.save();
      }
    } catch (e) {}

    // Audit Log
    try {
      await AuditLog.createLog({
        action: "SHARE",
        status: "SUCCESS",
        user: req.user._id,
        userEmail: req.user.email,
        walletAddress: doc.ownerWalletAddress,
        document: doc._id,
        documentTitle: doc.title,
        ipfsCid: doc.ipfsCid,
        targetUser: targetUser ? targetUser._id : null,
        targetWalletAddress: targetWallet || "pending",
        txHash: txHash || null,
        description: "Shared document '" + doc.title + "' with " + (targetEmail || targetWallet),
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: targetWallet
        ? "Document shared successfully"
        : "Share invitation saved for " + targetEmail + ". On-chain access will activate when they link their wallet.",
      data: { share, document: doc },
    });
  } catch (error) {
    logger.error("grantShareAccess failed: " + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/share/shared-with-me
const getSharedWithMe = async (req, res) => {
  try {
    const userWallet = req.user.walletAddress ? req.user.walletAddress.toLowerCase() : null;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : null;

    const filter = {
      $or: [
        { recipient: req.user._id },
        ...(userEmail ? [{ recipientEmail: userEmail }] : []),
        ...(userWallet ? [{ recipientWalletAddress: userWallet }] : []),
      ],
      status: "active",
    };

    const shares = await Share.find(filter)
      .populate("document")
      .populate("owner", "fullName email avatar")
      .sort({ createdAt: -1 })
      .lean();

    const validShares = shares.filter(s => s.document && !s.document.isDeleted);

    return res.status(200).json({
      success: true,
      message: "Shared documents fetched successfully",
      data: { shares: validShares, count: validShares.length },
    });
  } catch (error) {
    logger.error("getSharedWithMe failed: " + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/share/revoke
const revokeShareAccess = async (req, res) => {
  try {
    const { documentId, recipientWalletAddress, recipientEmail, revokeTxHash } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, message: "documentId is required" });
    }

    const doc = await Document.findOne({ _id: documentId, owner: req.user._id, isDeleted: false });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const targetWallet = recipientWalletAddress ? recipientWalletAddress.trim().toLowerCase() : null;
    const targetEmail = recipientEmail ? recipientEmail.trim().toLowerCase() : null;

    const share = await Share.findOneAndUpdate(
      {
        document: doc._id,
        $or: [
          ...(targetWallet ? [{ recipientWalletAddress: targetWallet }] : []),
          ...(targetEmail ? [{ recipientEmail: targetEmail }] : []),
        ],
      },
      {
        status: "revoked",
        revokedAt: new Date(),
        revokeTxHash: revokeTxHash || null,
        revokedBy: req.user._id,
      },
      { returnDocument: "after" }
    );

    if (targetWallet) {
      doc.sharedWith = doc.sharedWith.filter(s => String(s.walletAddress).toLowerCase() !== targetWallet);
      await doc.save();
    }

    return res.status(200).json({
      success: true,
      message: "Access revoked successfully",
      data: { share, document: doc },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  resolveRecipient,
  grantShareAccess,
  getSharedWithMe,
  revokeShareAccess,
};
