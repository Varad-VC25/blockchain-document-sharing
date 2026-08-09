import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMoreVertical, FiEye, FiDownload, FiShare2, FiTrash2,
  FiUsers, FiCheckCircle, FiClock
} from "react-icons/fi";
import { formatFileSize, formatRelativeTime } from "@utils/formatters";
import { getFileIcon, getFileColor } from "@utils/fileHelpers";

const DocumentCard = ({ document, onView, onDownload, onShare, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = getFileIcon(document.mimeType, document.originalFileName);
  const gradient = getFileColor(document.mimeType, document.originalFileName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div className={"relative h-40 bg-gradient-to-br " + gradient + " flex items-center justify-center overflow-hidden"}>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <Icon className="text-6xl text-white relative z-10" />

        {/* Menu button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition-colors"
          >
            <FiMoreVertical className="text-white" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-900 rounded-xl shadow-xl border border-dark-200 dark:border-dark-700 z-30 overflow-hidden animate-slide-down">
                <button onClick={() => { onView(document); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800">
                  <FiEye />
                  View Details
                </button>
                <button onClick={() => { onDownload(document); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800">
                  <FiDownload />
                  Download
                </button>
                <button onClick={() => { onShare(document); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800">
                  <FiShare2 />
                  Share
                </button>
                <div className="border-t border-dark-100 dark:border-dark-800"></div>
                <button onClick={() => { onDelete(document); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {document.isOnBlockchain && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/90 backdrop-blur text-white text-xs font-semibold">
              <FiCheckCircle />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-dark-900 dark:text-white truncate mb-1" title={document.title}>
          {document.title}
        </h3>
        <p className="text-xs text-dark-500 truncate mb-3">{document.originalFileName}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-dark-500 mb-3">
          <span>{formatFileSize(document.fileSize)}</span>
          <span className="flex items-center gap-1">
            <FiClock />
            {formatRelativeTime(document.createdAt)}
          </span>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs">
                #{tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-500 text-xs">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-100 dark:border-dark-800">
          <div className="flex items-center gap-3 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <FiEye />
              {document.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <FiDownload />
              {document.downloadCount}
            </span>
          </div>
          {document.sharedWith && document.sharedWith.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <FiUsers />
              {document.sharedWith.length}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
