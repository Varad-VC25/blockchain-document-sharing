import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiUpload, FiTag, FiFileText, FiInfo, FiArrowLeft, FiX, FiPlus,
  FiCheckCircle, FiLink, FiExternalLink, FiShield, FiLock
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import DropZone from "@components/upload/DropZone";
import FilePreview from "@components/upload/FilePreview";
import UploadProgress from "@components/upload/UploadProgress";
import UploadWorkflow from "@components/upload/UploadWorkflow";
import documentService from "@services/documentService";
import { registerDocumentOnChain } from "@services/blockchainService";
import { useWallet } from "@context/WalletContext";

const Upload = () => {
  const navigate = useNavigate();
  const { account, connectWallet } = useWallet();

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
  const [resultDoc, setResultDoc] = useState(null);

  // Blockchain registration state
  const [isRegisteringBc, setIsRegisteringBc] = useState(false);
  const [bcTxHash, setBcTxHash] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadComplete(false);
    setResultDoc(null);
    setBcTxHash(null);
    setCurrentStep(0);
    setUploadProgress(0);

    if (!metadata.title) {
      const nameWithoutExt = file.name.split(".").slice(0, -1).join(".") || file.name;
      setMetadata((prev) => ({ ...prev, title: nameWithoutExt }));
    }
    toast.success("File selected: " + file.name);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMetadata({ title: "", description: "", category: "document", tags: [] });
    setUploadComplete(false);
    setResultDoc(null);
    setBcTxHash(null);
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
    setUploadProgress(5);
    setCurrentStep(1);

    try {
      setTimeout(() => { setCurrentStep(2); setUploadProgress(25); }, 400);
      setTimeout(() => { setCurrentStep(3); setUploadProgress(55); }, 900);

      const response = await documentService.uploadDocument(
        selectedFile,
        {
          title: metadata.title.trim(),
          description: metadata.description.trim(),
          category: metadata.category,
          tags: metadata.tags,
        },
        (progressEvent) => {
          if (!progressEvent.total) return;
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(Math.min(90, Math.max(10, pct)));
        }
      );

      setCurrentStep(4);
      setUploadProgress(95);
      await new Promise((r) => setTimeout(r, 300));
      setCurrentStep(4); // Finished IPFS + Cloud Backup
      setUploadProgress(100);

      const createdDoc = response?.data?.document || null;
      setResultDoc(createdDoc);
      setUploadComplete(true);
      toast.success("Encrypted & uploaded to IPFS + Cloudinary!");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Upload failed";
      toast.error(message);
      setCurrentStep(0);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // -- Blockchain Registration Handler -----------------------------------------
  const handleBlockchainRegister = async () => {
    if (!resultDoc) return;

    if (!account) {
      toast.info("Connecting MetaMask wallet...");
      const connected = await connectWallet();
      if (!connected) return;
    }

    setIsRegisteringBc(true);
    try {
      toast.info("Please confirm transaction in MetaMask...");
      const res = await registerDocumentOnChain(resultDoc);
      setBcTxHash(res.txHash);
      setCurrentStep(5); // Complete full 5-step workflow

      // Update backend database with txHash
      await documentService.updateBlockchainTx(resultDoc._id, res.txHash, account);

      toast.success("Document registered on Ethereum Blockchain!");
    } catch (err) {
      toast.error(err.message || "Blockchain registration failed");
    } finally {
      setIsRegisteringBc(false);
    }
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
          <p className="text-dark-500 mt-1">Encrypt (AES-256) ? IPFS + Cloud Backup ? Blockchain Proof</p>
        </div>
        {selectedFile && !uploadComplete && (
          <button onClick={handleRemoveFile} className="btn-secondary text-sm flex items-center gap-2" disabled={isUploading}>
            <FiX />
            Cancel
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Blockchain Document Registration</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Documents are encrypted, saved to IPFS + Cloudinary, and verified on Ethereum via Smart Contract.
            </p>
          </div>
        </div>
      </div>

      {/* Success Screen */}
      <AnimatePresence>
        {uploadComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl border border-purple-400/50"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <FiCheckCircle className="text-4xl text-green-400" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-center">Document Stored Successfully!</h2>
            <p className="text-dark-300 text-sm mb-6 text-center max-w-lg mx-auto">
              "{resultDoc?.title || selectedFile?.name}" has been encrypted with AES-256 and stored on IPFS & Cloudinary.
            </p>

            {/* Storage Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-left">
                <span className="text-white/70 block mb-1">IPFS Primary CID</span>
                <span className="font-mono text-white truncate block">
                  {resultDoc?.ipfsCid ? resultDoc.ipfsCid.substring(0, 18) + "..." : "Pinned"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-left">
                <span className="text-white/70 block mb-1">Cloud Backup</span>
                <span className="font-semibold text-green-200">Backed Up</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-left">
                <span className="text-white/70 block mb-1">Blockchain Verification</span>
                {bcTxHash || resultDoc?.isOnBlockchain ? (
                  <span className="font-semibold text-green-200 flex items-center gap-1">
                    <FiCheckCircle /> Registered
                  </span>
                ) : (
                  <span className="font-semibold text-yellow-200">Pending Registration</span>
                )}
              </div>
            </div>

            {/* BLOCKCHAIN REGISTRATION BUTTON */}
            {!(bcTxHash || resultDoc?.isOnBlockchain) ? (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center max-w-xl mx-auto">
                <h3 className="font-bold text-lg mb-1 flex items-center justify-center gap-2">
                      <FiLink className="text-white" />
                  Register Proof on Ethereum Blockchain
                </h3>
                <p className="text-xs text-white/80 mb-4">
                  Sign an Ethereum transaction via MetaMask to permanently register this document's CID & SHA-256 hash on-chain.
                </p>
                <button
                  onClick={handleBlockchainRegister}
                  disabled={isRegisteringBc}
                  className="btn-primary py-3 px-8 text-sm font-bold flex items-center justify-center gap-2 mx-auto shadow-lg shadow-primary-500/30"
                >
                  {isRegisteringBc ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirm in MetaMask...</span>
                    </>
                  ) : (
                    <>
                      <FiLock />
                      Register on Blockchain
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 mb-6 text-center max-w-xl mx-auto font-mono text-xs">
                <p className="text-green-200 font-bold mb-1 flex items-center justify-center gap-1">
                  <FiCheckCircle /> On-Chain Registered!
                </p>
                <p className="text-white/80 truncate">Tx: {bcTxHash || resultDoc?.txHash}</p>
              </div>
            )}

            {/* Action Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={handleRemoveFile} className="btn-secondary text-sm">
                Upload Another Document
              </button>
              <button onClick={() => navigate("/documents")} className="btn-primary text-sm">
                View All Documents
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Upload Area */}
      {!uploadComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <DropZone key="dropzone" onFileSelect={handleFileSelect} disabled={isUploading} />
              ) : (
                <FilePreview key="preview" file={selectedFile} onRemove={handleRemoveFile} disabled={isUploading} />
              )}
            </AnimatePresence>

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
                    className="input-field"
                    placeholder="Enter document title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Description</label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    disabled={isUploading}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Optional description"
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
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Tags ({metadata.tags.length}/10)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        disabled={isUploading || metadata.tags.length >= 10}
                        className="input-field pl-10"
                        placeholder="Add tag and press Enter"
                      />
                    </div>
                    <button type="button" onClick={handleAddTag} disabled={isUploading} className="btn-primary px-4">
                      <FiPlus />
                    </button>
                  </div>
                  {metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {metadata.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">
                          #{tag}
                          <button onClick={() => handleRemoveTag(tag)} disabled={isUploading}>
                            <FiX />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isUploading && (
                  <UploadProgress
                    progress={uploadProgress}
                    status={uploadProgress >= 100 ? "complete" : "uploading"}
                  />
                )}

                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !metadata.title.trim()}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Storage Pipeline...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Encrypt & Upload Document
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <UploadWorkflow currentStep={currentStep} />
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-3">Multi-Tier Architecture</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>1. AES-256 Client-side Encryption</li>
                <li>2. SHA-256 Cryptographic Hash</li>
                <li>3. IPFS Decentralized Pinning</li>
                <li>4. Cloudinary Encrypted Backup</li>
                <li>5. Ethereum Blockchain Registration</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
