import { FiFolder, FiUpload, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const EmptyState = ({ hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="p-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
          <FiSearch className="text-4xl text-dark-400" />
        </div>
        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">No documents found</h3>
        <p className="text-dark-500 mb-6">Try adjusting your search or filters</p>
        <button onClick={onClearFilters} className="btn-secondary">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="p-16 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
        <FiFolder className="text-5xl text-white" />
      </div>
      <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">No documents yet</h3>
      <p className="text-dark-500 mb-8 max-w-md mx-auto">
        Start securing your documents with military-grade encryption and blockchain verification
      </p>
      <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
        <FiUpload />
        Upload Your First Document
      </Link>
    </div>
  );
};

export default EmptyState;
