import { useState, useRef, useCallback } from "react";
import { FiUploadCloud, FiFile, FiImage, FiFileText, FiFilm } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { validateFile, DEFAULT_FILE_SETTINGS } from "@utils/fileHelpers";

const DropZone = ({ onFileSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = "";
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const validation = validateFile(file, DEFAULT_FILE_SETTINGS);

    if (!validation.valid) {
      validation.errors.forEach((err) => toast.error(err));
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={"relative rounded-3xl border-2 border-dashed p-12 lg:p-16 text-center cursor-pointer transition-all duration-300 " +
        (disabled ? "opacity-50 cursor-not-allowed border-dark-200 dark:border-dark-800" :
        isDragging ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]" :
        "border-dark-300 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/10")}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        disabled={disabled}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 rounded-3xl pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Animated Upload Icon */}
        <motion.div
          animate={isDragging ? { y: -8 } : { y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-flex mb-6"
        >
          <div className={"w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl transition-all " +
            (isDragging ? "bg-gradient-to-br from-primary-600 to-purple-600 shadow-primary-500/50" : "bg-gradient-to-br from-primary-500 to-purple-500 shadow-primary-500/30")}>
            <FiUploadCloud className="text-5xl text-white" />
          </div>
        </motion.div>

        {/* Text */}
        <h3 className="text-2xl lg:text-3xl font-bold text-dark-900 dark:text-white mb-3">
          {isDragging ? "Drop your file here" : "Upload your document"}
        </h3>
        <p className="text-dark-500 dark:text-dark-400 mb-2">
          Drag and drop your file or click to browse
        </p>
        <p className="text-sm text-dark-400 mb-8">
          Maximum file size: 50MB
        </p>

        {/* File Type Icons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { icon: FiFileText, label: "PDF" },
            { icon: FiFileText, label: "DOCX" },
            { icon: FiImage, label: "Images" },
            { icon: FiFile, label: "Files" },
          ].map((type, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-100 dark:bg-dark-800 text-sm text-dark-600 dark:text-dark-400">
              <type.icon />
              {type.label}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled={disabled}
          className="btn-primary px-8 py-3 text-base flex items-center gap-2 mx-auto"
        >
          <FiUploadCloud />
          Choose File
        </button>

        {/* Security Note */}
        <div className="mt-8 pt-8 border-t border-dark-200 dark:border-dark-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-dark-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              AES-256 Encrypted
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              IPFS + Cloud Backup
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              Blockchain Verified
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DropZone;
