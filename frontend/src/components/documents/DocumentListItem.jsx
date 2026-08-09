import { motion } from "framer-motion";
import {
  FiEye, FiDownload, FiShare2, FiTrash2, FiCheckCircle, FiUsers
} from "react-icons/fi";
import { formatFileSize, formatDate } from "@utils/formatters";
import { getFileIcon, getFileColor } from "@utils/fileHelpers";

const DocumentListItem = ({ document, onView, onDownload, onShare, onDelete }) => {
  const Icon = getFileIcon(document.mimeType, document.originalFileName);
  const gradient = getFileColor(document.mimeType, document.originalFileName);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
    >
      {/* Icon */}
      <div className={"w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br " + gradient + " shadow-md"}>
        <Icon className="text-2xl text-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-dark-900 dark:text-white truncate">{document.title}</h3>
          {document.isOnBlockchain && (
            <FiCheckCircle className="text-green-500 flex-shrink-0" title="Blockchain verified" />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-dark-500">
          <span>{document.originalFileName}</span>
          <span>�</span>
          <span>{formatFileSize(document.fileSize)}</span>
          <span>�</span>
          <span>{formatDate(document.createdAt)}</span>
          {document.sharedWith && document.sharedWith.length > 0 && (
            <>
              <span>�</span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <FiUsers />
                {document.sharedWith.length} shared
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onView(document)} title="View" className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-500 hover:text-primary-600 transition-colors">
          <FiEye />
        </button>
        <button onClick={() => onDownload(document)} title="Download" className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-500 hover:text-blue-600 transition-colors">
          <FiDownload />
        </button>
        <button onClick={() => onShare(document)} title="Share" className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-500 hover:text-purple-600 transition-colors">
          <FiShare2 />
        </button>
        <button onClick={() => onDelete(document)} title="Delete" className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-500 hover:text-red-600 transition-colors">
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};

export default DocumentListItem;
