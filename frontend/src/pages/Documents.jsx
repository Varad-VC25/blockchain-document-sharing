import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiInfo, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DocumentCard from "@components/documents/DocumentCard";
import DocumentListItem from "@components/documents/DocumentListItem";
import DocumentFilters from "@components/documents/DocumentFilters";
import DocumentDetailsModal from "@components/documents/DocumentDetailsModal";
import ShareModal from "@components/documents/ShareModal";
import EmptyState from "@components/documents/EmptyState";
import Loader from "@components/common/Loader";
import documentService from "@services/documentService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shareDoc, setShareDoc] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentService.getMyDocuments({
        search: searchQuery,
        category,
        sort: sortBy,
      });
      setDocuments(response?.data?.documents || []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load documents";
      toast.error(message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchDocuments();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const filteredDocs = useMemo(() => documents, [documents]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setSortBy("newest");
  };

  const handleView = async (doc) => {
    try {
      const response = await documentService.getDocumentById(doc._id);
      setSelectedDoc(response?.data?.document || doc);
    } catch (error) {
      setSelectedDoc(doc);
    }
  };

  const handleDownload = () => {
    toast.info("Secure download comes in Module 19");
  };

  const handleShare = (doc) => {
    setShareDoc(doc);
  };

  const handleDelete = async (doc) => {
    const ok = window.confirm("Delete this document?");
    if (!ok) return;

    try {
      await documentService.deleteDocument(doc._id);
      toast.success("Document deleted");
      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
      if (selectedDoc?._id === doc._id) setSelectedDoc(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const hasFilters = searchQuery || category !== "all" || sortBy !== "newest";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">My Documents</h1>
          <p className="text-dark-500 mt-1">
            {loading ? "Loading..." : filteredDocs.length + " document" + (filteredDocs.length !== 1 ? "s" : "")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDocuments} className="btn-secondary flex items-center gap-2">
            <FiRefreshCw />
            Refresh
          </button>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <FiPlus />
            Upload Document
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Your Encrypted Documents</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Showing your encrypted documents stored on IPFS with optional cloud backup and blockchain verification.
            </p>
          </div>
        </div>
      </div>

      <DocumentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <Loader text="Loading documents..." />
      ) : filteredDocs.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              onView={handleView}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <DocumentListItem
              key={doc._id}
              document={doc}
              onView={handleView}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {shareDoc && (
        <ShareModal
          document={shareDoc}
          onClose={() => setShareDoc(null)}
          onSuccess={fetchDocuments}
        />
      )}

      {selectedDoc && (
        <DocumentDetailsModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default Documents;
