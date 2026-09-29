import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShield, FiUserCheck, FiSlash } from "react-icons/fi";
import { toast } from "react-toastify";
import { useWallet } from "@context/WalletContext";
import { revokeAccessOnChain } from "@services/blockchainService";
import shareService from "@services/shareService";
import { truncateAddress } from "@utils/formatters";

const RevokeModal = ({ document, onClose, onSuccess }) => {
  if (!document) return null;

  const { account, connectWallet } = useWallet();
  const [revokingAddress, setRevokingAddress] = useState(null);

  const sharedList = document.sharedWith || [];

  const handleRevoke = async (recipientWallet) => {
    if (!account) {
      toast.info("Connecting MetaMask wallet...");
      const connected = await connectWallet();
      if (!connected) return;
    }

    setRevokingAddress(recipientWallet);
    try {
      let revokeTxHash = null;

      // 1. On-Chain Revocation on Smart Contract if wallet address
      if (/^0x[a-f0-9]{40}$/i.test(recipientWallet)) {
        toast.info("Please confirm revokeAccess transaction in MetaMask...");
        const bcRes = await revokeAccessOnChain(document.ipfsCid, recipientWallet.toLowerCase());
        revokeTxHash = bcRes.txHash;
        toast.success("Access revoked on-chain!");
      }

      // 2. Off-Chain MongoDB update
      await shareService.revokeShareAccess({
        documentId: document._id,
        recipientWalletAddress: recipientWallet,
        revokeTxHash,
      });

      toast.success("Access revoked successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to revoke access");
    } finally {
      setRevokingAddress(null);
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
          <div className="p-6 bg-gradient-to-r from-red-600 to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Manage & Revoke Access</h3>
                <p className="text-xs text-white/80 truncate max-w-[260px]">{document.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <FiX className="text-lg" />
            </button>
          </div>

          {/* List of Authorized Users */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {sharedList.length === 0 ? (
              <div className="text-center py-8 text-dark-500">
                <FiUserCheck className="text-4xl mx-auto mb-2 text-dark-400" />
                <p className="text-sm">No wallet addresses currently have access to this document.</p>
              </div>
            ) : (
              sharedList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700">
                  <div>
                    <p className="font-mono text-xs font-bold text-dark-900 dark:text-white">
                      {truncateAddress(item.walletAddress)}
                    </p>
                    <p className="text-[10px] text-dark-400 mt-0.5">
                      Granted: {new Date(item.sharedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(item.walletAddress)}
                    disabled={revokingAddress === item.walletAddress}
                    className="btn-danger py-2 px-3 text-xs flex items-center gap-1.5 shadow-md"
                  >
                    {revokingAddress === item.walletAddress ? (
                      <span>Revoking...</span>
                    ) : (
                      <>
                        <FiSlash />
                        <span>Revoke Access</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-dark-50 dark:bg-dark-950 border-t border-dark-200 dark:border-dark-800 flex justify-end">
            <button onClick={onClose} className="btn-secondary text-sm py-2 px-6">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RevokeModal;
