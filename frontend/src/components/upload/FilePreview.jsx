import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX, FiEye } from "react-icons/fi";
import { formatFileSize } from "@utils/formatters";
import { getFileIcon, getFileColor, readFileAsDataURL } from "@utils/fileHelpers";

const FilePreview = ({ file, onRemove, disabled = false }) => {
  const [preview, setPreview] = useState(null);
  const Icon = getFileIcon(file.type, file.name);
  const gradient = getFileColor(file.type, file.name);
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (isImage) {
      readFileAsDataURL(file).then(setPreview);
    }
  }, [file, isImage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative p-6 rounded-2xl bg-white dark:bg-dark-900 border-2 border-primary-200 dark:border-primary-800 shadow-lg"
    >
      {/* Remove button */}
      {!disabled && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors z-10"
          title="Remove file"
        >
          <FiX />
        </button>
      )}

      <div className="flex items-start gap-4">
        {/* Thumbnail or Icon */}
        <div className={"w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br " + gradient + " overflow-hidden"}>
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <Icon className="text-4xl text-white" />
          )}
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg text-dark-900 dark:text-white truncate pr-8" title={file.name}>
            {file.name}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-dark-500">
            <span className="badge badge-info">{file.type || "Unknown"}</span>
            <span>�</span>
            <span className="font-medium">{formatFileSize(file.size)}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Ready to encrypt
            </div>
            {isImage && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium">
                <FiEye />
                Preview available
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreview;
