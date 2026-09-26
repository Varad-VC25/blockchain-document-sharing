const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { logger } = require("../utils/logger");

// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/user/wallet
// Body: { walletAddress }
const linkWallet = async (req, res) => {
  try {
    let { walletAddress } = req.body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({
        success: false,
        message: "walletAddress is required",
      });
    }

    walletAddress = walletAddress.trim().toLowerCase();

    // Basic Ethereum address validation
    if (!/^0x[a-f0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ethereum wallet address",
      });
    }

    // Prevent linking same wallet to another account
    const existing = await User.findOne({
      walletAddress,
      _id: { $ne: req.user._id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This wallet is already linked to another account",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress },
      { returnDocument: 'after', runValidators: true }
    );

    try {
      await AuditLog.createLog({
        action: "WALLET_CONNECT",
        status: "SUCCESS",
        user: user._id,
        userEmail: user.email,
        walletAddress,
        ipAddress: req.ip,
        description: "Wallet linked: " + walletAddress,
      });
    } catch (e) {}

    logger.info("Wallet linked for user " + user.email + " -> " + walletAddress);

    return res.status(200).json({
      success: true,
      message: "Wallet linked successfully",
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    logger.error("linkWallet failed: " + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/user/wallet
const unlinkWallet = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress: null },
      { returnDocument: 'after' }
    );

    try {
      await AuditLog.createLog({
        action: "WALLET_DISCONNECT",
        status: "SUCCESS",
        user: user._id,
        userEmail: user.email,
        ipAddress: req.ip,
        description: "Wallet unlinked for user " + user.email,
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: "Wallet unlinked successfully",
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  linkWallet,
  unlinkWallet,
};
