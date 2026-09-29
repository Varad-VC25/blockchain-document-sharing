import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const { account, connectWallet } = useWallet();
  const [docState, setDocState] = useState(document);
  const [isRegistering, setIsRegistering] = useState(false);

  // Sync internal state if prop document changes
  useEffect(() => {
    setDocState(document);
  }, [document]);

  // 1. Prevent body scrolling behind the modal while open
  useEffect(() => {
    if (!document) return;
    const originalOverflow = window.getComputedStyle(window.document.body).overflow;
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.body.style.overflow = originalOverflow;
    };
  }, [document]);

  // 2. Close modal when pressing the Escape key
  useEffect(() => {
    if (!document) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [document, onClose]);

  if (!document || !docState) return null;

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
      
      // Update backend MongoDB
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

  // 3. Render using React Portal into the browser document to bypass parent stacking contexts
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        {/* Backdrop (Darkened & Blurred Page Layer) */}
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Layer (Sharp & Unaffected by Backdrop Filters) */}
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
          <motion.div
            key="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden border border-dark-200 dark:border-dark-800"
          >
            {/* Header */}
            <div className={"relative p-6 bg-gradient-to-br " + gradient + " text-white rounded-t-2xl overflow-hidden flex-shrink-0"}>
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur transition-colors cursor-pointer z-10"
              >
                <FiX className="text-xl text-white" />
              </button>

              <div className="relative flex items-start gap-4 pr-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <Icon className="text-3xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="modal-title" className="text-2xl font-bold mb-1 truncate">{docState.title}</h2>
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

            {/* Scrollable Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {docState.description && (
                <div>
                  <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                    <FiFileText />
                    Description
                  </h4>
                  <p className="text-dark-600 dark:text-dark-400 text-sm">{docState.description}</p>
                </div>
              )}

              {/* On-Chain Registration Action Banner */}
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
                    type="button"
                    onClick={handleOnChainRegister}
                    disabled={isRegistering}
                    className="btn-primary py-2 px-4 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
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
                      <button type="button" onClick={() => copyToClipboard(docState.fileHash, "Hash")} className="text-primary-600 hover:text-primary-700 cursor-pointer">
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
                      <button type="button" onClick={() => copyToClipboard(docState.ipfsCid, "CID")} className="text-primary-600 hover:text-primary-700 cursor-pointer">
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
                        <button type="button" onClick={() => copyToClipboard(docState.txHash, "TxHash")} className="text-green-600 cursor-pointer">
                          <FiCopy />
                        </button>
                      </div>
                      <p className="text-xs font-mono text-green-800 dark:text-green-300 break-all">{docState.txHash}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="flex items-center gap-3 p-6 border-t border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 rounded-b-2xl flex-shrink-0">
              <button
                type="button"
                onClick={() => onDownload(docState)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer"
              >
                <FiDownload />
                Download
              </button>
              <button
                type="button"
                onClick={() => onShare(docState)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer"
              >
                <FiShare2 />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    window.document.body
  );
};

export default DocumentDetailsModal;
