import { FiSearch, FiGrid, FiList, FiFilter, FiX } from "react-icons/fi";

const DocumentFilters = ({
  searchQuery, onSearchChange,
  category, onCategoryChange,
  sortBy, onSortChange,
  viewMode, onViewModeChange,
  onClearFilters,
}) => {
  const hasFilters = searchQuery || category !== "all" || sortBy !== "newest";

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, filename, or tag..."
            className="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 rounded-lg text-sm focus:outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2 bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="document">Documents</option>
          <option value="image">Images</option>
          <option value="spreadsheet">Spreadsheets</option>
          <option value="presentation">Presentations</option>
          <option value="other">Other</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 rounded-lg text-sm focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="size">Size (largest)</option>
          <option value="size-asc">Size (smallest)</option>
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiX />
            Clear
          </button>
        )}

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-dark-100 dark:bg-dark-800 rounded-lg">
          <button
            onClick={() => onViewModeChange("grid")}
            className={"p-2 rounded transition-colors " + (viewMode === "grid" ? "bg-white dark:bg-dark-900 shadow text-primary-600" : "text-dark-500")}
            title="Grid view"
          >
            <FiGrid />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={"p-2 rounded transition-colors " + (viewMode === "list" ? "bg-white dark:bg-dark-900 shadow text-primary-600" : "text-dark-500")}
            title="List view"
          >
            <FiList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;
