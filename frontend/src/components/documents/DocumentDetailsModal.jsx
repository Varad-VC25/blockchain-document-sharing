import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiDownload, FiShare2, FiCopy, FiExternalLink,
  FiCheckCircle, FiUsers, FiEye, FiClock, FiFileText,
  FiHash, FiCloud, FiLink
} from "react-icons/fi";
import { toast } from "react-toastify";
import { formatFileSize, formatDateTime, truncateAddress } from "@utils/formatters";
import { getFileIcon, getFileColor } from "@utils/fileHelpers";

const DocumentDetailsModal = ({ document, onClose, onDownload, onShare }) => {
  if (!document) return null;

  const Icon = getFileIcon(document.mimeType, document.originalFileName);
  const gradient = getFileColor(document.mimeType, document.originalFileName);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(label + " copied to clipboard");
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
                <h2 className="text-2xl font-bold mb-1 truncate">{document.title}</h2>
                <p className="text-white/80 text-sm truncate">{document.originalFileName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {document.isOnBlockchain && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                      <FiCheckCircle />
                      Blockchain Verified
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
                    {formatFileSize(document.fileSize)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase">
                    {document.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {document.description && (
              <div>
                <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                  <FiFileText />
                  Description
                </h4>
                <p className="text-dark-600 dark:text-dark-400 text-sm">{document.description}</p>
              </div>
            )}

            {document.tags && document.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div>
              <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">Statistics</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800 text-center">
                  <FiEye className="mx-auto mb-1 text-primary-600" />
                  <p className="text-2xl font-bold text-dark-900 dark:text-white">{document.viewCount}</p>
                  <p className="text-xs text-dark-500">Views</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800 text-center">
                  <FiDownload className="mx-auto mb-1 text-blue-600" />
                  <p className="text-2xl font-bold text-dark-900 dark:text-white">{document.downloadCount}</p>
                  <p className="text-xs text-dark-500">Downloads</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800 text-center">
                  <FiUsers className="mx-auto mb-1 text-purple-600" />
                  <p className="text-2xl font-bold text-dark-900 dark:text-white">{document.sharedWith?.length || 0}</p>
                  <p className="text-xs text-dark-500">Shared</p>
                </div>
              </div>
            </div>

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
                    <button onClick={() => copyToClipboard(document.fileHash, "Hash")} className="text-primary-600 hover:text-primary-700">
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-dark-700 dark:text-dark-300 break-all">{document.fileHash}</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-dark-500 uppercase flex items-center gap-1">
                      <FiCloud />
                      IPFS CID
                    </span>
                    <button onClick={() => copyToClipboard(document.ipfsCid, "CID")} className="text-primary-600 hover:text-primary-700">
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-dark-700 dark:text-dark-300 break-all">{document.ipfsCid}</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-dark-500 uppercase flex items-center gap-1">
                      <FiLink />
                      Owner Wallet
                    </span>
                    <button onClick={() => copyToClipboard(document.ownerWalletAddress, "Address")} className="text-primary-600 hover:text-primary-700">
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-dark-700 dark:text-dark-300">{truncateAddress(document.ownerWalletAddress)}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2 flex items-center gap-2">
                <FiClock />
                Timestamps
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <span className="text-dark-500">Created</span>
                  <span className="font-medium text-dark-900 dark:text-white">{formatDateTime(document.createdAt)}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-dark-50 dark:bg-dark-800">
                  <span className="text-dark-500">Updated</span>
                  <span className="font-medium text-dark-900 dark:text-white">{formatDateTime(document.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 flex items-center gap-3 p-6 border-t border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 rounded-b-2xl">
            <button onClick={() => onDownload(document)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <FiDownload />
              Download
            </button>
            <button onClick={() => onShare(document)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <FiShare2 />
              Share
            </button>
            <button
              onClick={() => window.open("https://ipfs.io/ipfs/" + document.ipfsCid, "_blank")}
              className="btn-outline flex items-center gap-2"
              title="View on IPFS"
            >
              <FiExternalLink />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentDetailsModal;
