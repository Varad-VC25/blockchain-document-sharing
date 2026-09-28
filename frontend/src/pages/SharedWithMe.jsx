import { useEffect, useState } from "react";
import { FiShare2, FiRefreshCw, FiInfo, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import shareService from "@services/shareService";
import { formatFileSize, formatDate, truncateAddress } from "@utils/formatters";
import Loader from "@components/common/Loader";
import DocumentDetailsModal from "@components/documents/DocumentDetailsModal";

const SharedWithMe = () => {
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchSharedDocs = async () => {
    setLoading(true);
    try {
      const res = await shareService.getSharedWithMe();
      setShares(res?.data?.shares || []);
    } catch (err) {
      toast.error("Failed to load shared documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedDocs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Shared With Me</h1>
          <p className="text-dark-500 mt-1">Documents authorized for your wallet address</p>
        </div>
        <button onClick={fetchSharedDocs} className="btn-secondary flex items-center gap-2">
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <FiInfo className="text-purple-600 dark:text-purple-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-300">Permissioned Access Control</p>
            <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              Documents listed here have been explicitly granted read permissions to your wallet address.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading shared documents..." />
      ) : shares.length === 0 ? (
        <div className="p-16 rounded-2xl bg-white dark:bg-dark-900 border border-dashed border-dark-200 dark:border-dark-800 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <FiShare2 className="text-4xl text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">No shared documents found</h3>
          <p className="text-dark-500">When another user shares a document with your wallet address, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shares.map((share) => {
            const doc = share.document;
            if (!doc) return null;
            return (
              <div key={share._id} className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-lg transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge badge-info">{doc.category || "Document"}</span>
                  <span className="text-xs text-dark-400 font-mono">{formatFileSize(doc.fileSize)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 dark:text-white truncate">{doc.title}</h3>
                  <p className="text-xs text-dark-500 truncate">{doc.originalFileName}</p>
                </div>
                <div className="p-3 rounded-lg bg-dark-50 dark:bg-dark-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Owner:</span>
                    <span className="font-mono text-dark-900 dark:text-white">{truncateAddress(share.ownerWalletAddress)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Shared On:</span>
                    <span>{formatDate(share.createdAt)}</span>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button onClick={() => setSelectedDoc(doc)} className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1">
                    <FiEye /> View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDoc && (
        <DocumentDetailsModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={() => toast.info("Permissioned decryption coming in Module 19")}
          onShare={() => {}}
        />
      )}
    </div>
  );
};

export default SharedWithMe;
