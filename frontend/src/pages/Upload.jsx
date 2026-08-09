import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUpload, FiTag, FiFileText, FiInfo, FiArrowLeft, FiX, FiPlus, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import DropZone from "@components/upload/DropZone";
import FilePreview from "@components/upload/FilePreview";
import UploadProgress from "@components/upload/UploadProgress";
import UploadWorkflow from "@components/upload/UploadWorkflow";

const Upload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    category: "document",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (!metadata.title) {
      const nameWithoutExt = file.name.split(".").slice(0, -1).join(".") || file.name;
      setMetadata({ ...metadata, title: nameWithoutExt });
    }
    toast.success("File selected: " + file.name);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMetadata({ title: "", description: "", category: "document", tags: [] });
    setUploadComplete(false);
    setCurrentStep(0);
    setUploadProgress(0);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !metadata.tags.includes(tag) && metadata.tags.length < 10) {
      setMetadata({ ...metadata, tags: [...metadata.tags, tag] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setMetadata({ ...metadata, tags: metadata.tags.filter((t) => t !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    if (!metadata.title.trim()) {
      toast.error("Please provide a title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep(0);

    // SIMULATED workflow - actual encryption/IPFS/blockchain in modules 10-14
    try {
      const steps = 5;
      for (let i = 1; i <= steps; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUploadProgress((i / steps) * 100);
      }

      setUploadComplete(true);
      toast.success("Upload UI test complete! Real upload activates in Module 11.");
    } catch (error) {
      toast.error("Upload failed: " + error.message);
      setIsUploading(false);
      setCurrentStep(0);
      setUploadProgress(0);
    }
  };

  const handleNewUpload = () => {
    setSelectedFile(null);
    setMetadata({ title: "", description: "", category: "document", tags: [] });
    setIsUploading(false);
    setUploadProgress(0);
    setCurrentStep(0);
    setUploadComplete(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 mb-2">
            <FiArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Upload Document</h1>
          <p className="text-dark-500 mt-1">Encrypt and store your document securely</p>
        </div>
        {selectedFile && !uploadComplete && (
          <button onClick={handleRemoveFile} className="btn-secondary text-sm flex items-center gap-2">
            <FiX />
            Cancel
          </button>
        )}
      </div>

      {/* Module Info Banner */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Module 8 - Upload UI Preview</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This is the beautiful upload interface. Real AES-256 encryption (Module 10), IPFS upload (Module 11), Cloudinary backup (Module 12), and blockchain registration (Module 14) will be added in upcoming modules.
            </p>
          </div>
        </div>
      </div>

      {/* Success Screen */}
      <AnimatePresence>
        {uploadComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-center shadow-2xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <FiCheckCircle className="text-6xl" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Upload Complete!</h2>
            <p className="text-white/90 mb-8 max-w-md mx-auto">
              Your file "{selectedFile?.name}" has been processed through the upload workflow. Real integration activates in Module 11.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={handleNewUpload} className="px-6 py-3 rounded-lg bg-white text-green-600 font-bold hover:bg-green-50 transition-colors">
                Upload Another
              </button>
              <button onClick={() => navigate("/documents")} className="px-6 py-3 rounded-lg bg-white/20 backdrop-blur text-white font-bold hover:bg-white/30 transition-colors border border-white/30">
                View Documents
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Upload Area */}
      {!uploadComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* DropZone or FilePreview */}
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <DropZone key="dropzone" onFileSelect={handleFileSelect} disabled={isUploading} />
              ) : (
                <FilePreview key="preview" file={selectedFile} onRemove={handleRemoveFile} disabled={isUploading} />
              )}
            </AnimatePresence>

            {/* Metadata Form */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 space-y-4"
              >
                <h3 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                  <FiFileText />
                  Document Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    disabled={isUploading}
                    placeholder="Enter document title"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Description</label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    disabled={isUploading}
                    placeholder="Optional description..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Category</label>
                  <select
                    value={metadata.category}
                    onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                    disabled={isUploading}
                    className="input-field"
                  >
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="spreadsheet">Spreadsheet</option>
                    <option value="presentation">Presentation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Tags ({metadata.tags.length}/10)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        disabled={isUploading || metadata.tags.length >= 10}
                        placeholder="Add tag and press Enter"
                        className="input-field pl-10"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={isUploading || !tagInput.trim() || metadata.tags.length >= 10}
                      className="btn-primary px-4 flex items-center gap-2"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  {metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {metadata.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">
                          #{tag}
                          <button onClick={() => handleRemoveTag(tag)} disabled={isUploading} className="hover:text-red-500">
                            <FiX />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && <UploadProgress progress={uploadProgress} status={uploadProgress >= 100 ? "complete" : "uploading"} />}

                {/* Submit Button */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !metadata.title.trim()}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Encrypt and Upload
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <UploadWorkflow currentStep={currentStep} />

            {/* Security Info */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-3">Zero Knowledge</h3>
              <p className="text-white/90 text-sm mb-4">
                Your files are encrypted before leaving your device. Not even we can access them.
              </p>
              <div className="space-y-2 text-sm">
                {["Client-side AES-256", "SHA-256 verification", "Wallet-controlled access", "Blockchain immutability"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <FiCheckCircle className="flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
