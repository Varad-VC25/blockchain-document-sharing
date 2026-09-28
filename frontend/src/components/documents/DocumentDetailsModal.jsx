import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiDownload, FiShare2, FiCopy, FiExternalLink,
  FiCheckCircle, FiUsers, FiEye, FiClock, FiFileText,
  FiHash, FiCloud, FiLink, FiLock
} from "react-icons/fi";
import { toast } from "react-toastify";
import { formatFileSize, formatDateTime, truncateAddress } from "@utils/formatters";
import { getFileIcon, getFileColor } from "@utils/fileHelpers";
import { registerDocumentOnChain } from "@services/blockchainService";
import { useWallet } from "@context/WalletContext";
import documentService from "@services/documentService";

const DocumentDetailsModal = ({ document, onClose, onDownload, onShare }) => {
  if (!document) return null;

  const { account, connectWallet } = useWallet();
  const [docState, setDocState] = useState(document);
  const [isRegistering, setIsRegistering] = useState(false);

  const Icon = getFileIcon(docState.mimeType, docState.originalFileName);
  const gradient = getFileColor(docState.mimeType, docState.originalFileName);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(label + " copied to clipboard");
  };

  const handleOnChainRegister = async () => {
    if (!account) {
      toast.info("Connecting MetaMask...");
      const connected = await connectWallet();
      if (!connected) return;
    }
    setIsRegistering(true);
    try {
      toast.info("Please confirm transaction in MetaMask...");
      const res = await registerDocumentOnChain(docState);
      
      // Update backend
      await documentService.updateBlockchainTx(docState._id, res.txHash, account);
      
      setDocState({
        ...docState,
        isOnBlockchain: true,
        txHash: res.txHash,
      });

      toast.success("Document registered on Ethereum Blockchain!");
    } catch (err) {
      toast.error(err.message || "Blockchain registration failed");
    } finally {
      setIsRegistering(false);
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
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-900 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className={"relative p-6 bg-gradient-to-br " + gradient + " text-white rounded-t-2xl overflow-hidden"}>
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur transition-colors"
            >
              <FiX className="text-xl" />
            </button>
            <div className="relative flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Icon className="text-3xl" />
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <h2 className="text-2xl font-bold mb-1 truncate">{docState.title}</h2>
                <p className="text-white/80 text-sm truncate">{docState.originalFileName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {docState.isOnBlockchain ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/90 backdrop-blur text-xs font-semibold">
                      <FiCheckCircle />
                      Blockchain Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/90 backdrop-blur text-xs font-semibold">
                      Not On Blockchain
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                    {formatFileSize(docState.fileSize)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {docState.description && (
              <div>
                <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                  <FiFileText />
                  Description
                </h4>
                <p className="text-dark-600 dark:text-dark-400 text-sm">{docState.description}</p>
              </div>
            )}

            {/* On-Chain Action Banner */}
            {!docState.isOnBlockchain && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary-900/20 to-purple-900/20 border border-primary-500/30 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-dark-900 dark:text-white flex items-center gap-1.5">
                    <FiLock className="text-primary-600" />
                    Register on Blockchain
                  </p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    Permanently register this document's SHA-256 hash & CID on Ethereum.
                  </p>
                </div>
                <button
                  onClick={handleOnChainRegister}
                  disabled={isRegistering}
                  className="btn-primary py-2 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
                >
                  {isRegistering ? "Processing..." : "Register Now"}
                </button>
              </div>
            )}

            {/* Cryptographic Info */}
            <div>
              <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <FiHash />
                Cryptographic Info
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-dark-500 uppercase">SHA-256 Hash</span>
                    <button onClick={() => copyToClipboard(docState.fileHash, "Hash")} className="text-primary-600 hover:text-primary-700">
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-dark-700 dark:text-dark-300 break-all">{docState.fileHash}</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-dark-500 uppercase flex items-center gap-1">
                      <FiCloud />
                      IPFS CID
                    </span>
                    <button onClick={() => copyToClipboard(docState.ipfsCid, "CID")} className="text-primary-600 hover:text-primary-700">
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-dark-700 dark:text-dark-300 break-all">{docState.ipfsCid}</p>
                </div>
                {docState.txHash && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase flex items-center gap-1">
                        <FiLink />
                        Blockchain Tx Hash
                      </span>
                      <button onClick={() => copyToClipboard(docState.txHash, "TxHash")} className="text-green-600">
                        <FiCopy />
                      </button>
                    </div>
                    <p className="text-xs font-mono text-green-800 dark:text-green-300 break-all">{docState.txHash}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 flex items-center gap-3 p-6 border-t border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 rounded-b-2xl">
            <button onClick={() => onDownload(docState)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiDownload />
              Download
            </button>
            <button onClick={() => onShare(docState)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <FiShare2 />
              Share
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentDetailsModal;
