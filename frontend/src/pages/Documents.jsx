import { useState, useMemo } from "react";
import { FiPlus, FiFileText, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import DocumentCard from "@components/documents/DocumentCard";
import DocumentListItem from "@components/documents/DocumentListItem";
import DocumentFilters from "@components/documents/DocumentFilters";
import DocumentDetailsModal from "@components/documents/DocumentDetailsModal";
import EmptyState from "@components/documents/EmptyState";
import { mockDocuments } from "@utils/mockData";

const Documents = () => {
  const [documents] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredDocs = useMemo(() => {
    let result = [...documents];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.originalFileName.toLowerCase().includes(q) ||
        (doc.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter((doc) => doc.category === category);
    }

    // Sort
    const sorters = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      name: (a, b) => a.title.localeCompare(b.title),
      "name-desc": (a, b) => b.title.localeCompare(a.title),
      size: (a, b) => b.fileSize - a.fileSize,
      "size-asc": (a, b) => a.fileSize - b.fileSize,
    };
    result.sort(sorters[sortBy] || sorters.newest);
    return result;
  }, [documents, searchQuery, category, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setSortBy("newest");
  };

  const handleView = (doc) => setSelectedDoc(doc);
  const handleDownload = (doc) => toast.info("Download will be available in Module 19");
  const handleShare = (doc) => toast.info("Share feature will be available in Module 17");
  const handleDelete = (doc) => toast.info("Delete will be available in Module 11");

  const hasFilters = searchQuery || category !== "all" || sortBy !== "newest";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">My Documents</h1>
          <p className="text-dark-500 mt-1">{filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Upload Document
        </Link>
      </div>

      {/* Module Info */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Module 9 - My Documents UI</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This page uses sample data for UI demonstration. Real documents will appear from Module 11 (Document APIs) onwards.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Documents */}
      {filteredDocs.length === 0 ? (
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

      {/* Details Modal */}
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
