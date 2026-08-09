import { FiFileText, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const Documents = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">My Documents</h1>
          <p className="text-dark-500 mt-1">Manage your encrypted documents</p>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Upload Document
        </Link>
      </div>
      <div className="p-16 rounded-2xl bg-white dark:bg-dark-900 border border-dashed border-dark-200 dark:border-dark-800 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <FiFileText className="text-4xl text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">No documents yet</h3>
        <p className="text-dark-500 mb-6">This page will show your uploaded documents starting Module 9</p>
        <div className="inline-block px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
          Available in Module 9
        </div>
      </div>
    </div>
  );
};

export default Documents;
