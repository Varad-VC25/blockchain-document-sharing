import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShare2, FiUser, FiCalendar, FiCheckCircle, FiAlertCircle, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { useWallet } from "@context/WalletContext";
import { grantAccessOnChain } from "@services/blockchainService";
import shareService from "@services/shareService";

const ShareModal = ({ document, onClose, onSuccess }) => {
  if (!document) return null;

  const { account, connectWallet } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolvedUser, setResolvedUser] = useState(null);

  const handleRecipientBlur = async () => {
    if (!recipient.trim()) {
      setResolvedUser(null);
      return;
    }
    try {
      const res = await shareService.resolveRecipient(recipient.trim());
      setResolvedUser(res?.data || null);
    } catch (e) {
      setResolvedUser(null);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const input = recipient.trim();
    if (!input) {
      toast.error("Please enter a wallet address or email");
      return;
    }

    setLoading(true);
    let txHash = null;

    try {
      // 1. Resolve recipient to find if an on-chain wallet address exists
      const resolveRes = await shareService.resolveRecipient(input);
      const recipientData = resolveRes?.data || {};

      const walletToGrant = recipientData.walletAddress;
      const emailToShare = recipientData.type === "email" ? input : recipientData.userEmail;

      // 2. If a wallet address exists, execute on-chain grantAccess on Sepolia
      if (walletToGrant) {
        if (!account) {
          toast.info("Connecting MetaMask...");
          const connected = await connectWallet();
          if (!connected) {
            setLoading(false);
            return;
          }
        }

        toast.info("Please confirm grantAccess transaction in MetaMask...");
        const bcRes = await grantAccessOnChain(document.ipfsCid, walletToGrant);
        txHash = bcRes.txHash;
        toast.success("On-chain permission granted on Sepolia!");
      }

      // 3. Save MongoDB Share Record
      const shareRes = await shareService.grantShareAccess({
        documentId: document._id,
        recipientWalletAddress: walletToGrant || null,
        recipientEmail: emailToShare || null,
        message,
        expiresAt: expiresAt || null,
        txHash,
      });

      toast.success(shareRes?.message || "Document shared successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to share document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden border border-dark-200 dark:border-dark-800"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <FiShare2 className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Share Document</h3>
                <p className="text-xs text-white/80 truncate max-w-[260px]">{document.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleShare} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Recipient Wallet Address or Email *
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  onBlur={handleRecipientBlur}
                  placeholder="0x... or user@email.com"
                  required
                  disabled={loading}
                  className="input-field pl-11 text-sm font-mono"
                />
              </div>

              {/* Resolved Recipient Live Feedback */}
              {resolvedUser && (
                <div className="mt-2 p-2.5 rounded-lg bg-dark-50 dark:bg-dark-800 text-xs border border-dark-200 dark:border-dark-700 space-y-1">
                  {resolvedUser.userName && (
                    <p className="font-bold text-dark-900 dark:text-white flex items-center gap-1">
                      <FiCheckCircle className="text-green-500" />
                      User: {resolvedUser.userName}
                    </p>
                  )}
                  {resolvedUser.walletAddress ? (
                    <p className="font-mono text-green-600 dark:text-green-400 flex items-center gap-1">
                      <FiLock /> Wallet: {resolvedUser.walletAddress.slice(0, 10)}...{resolvedUser.walletAddress.slice(-6)} (On-Chain Ready)
                    </p>
                  ) : (
                    <p className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <FiAlertCircle /> No wallet linked yet. Will save invitation record.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Expiration Date (Optional)
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={loading}
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Optional Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note for the recipient..."
                rows={2}
                disabled={loading}
                className="input-field resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button type="button" onClick={onClose} disabled={loading} className="btn-secondary flex-1 py-2.5">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiShare2 />
                    <span>Grant Access</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;
