import { FiCloud } from "react-icons/fi";

const CloudStorage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Cloud Storage</h1>
        <p className="text-dark-500 mt-1">Cloudinary encrypted backup</p>
      </div>
      <div className="p-16 rounded-2xl bg-white dark:bg-dark-900 border border-dashed border-dark-200 dark:border-dark-800 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <FiCloud className="text-4xl text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Cloud Storage</h3>
        <p className="text-dark-500 mb-6">Cloud storage analytics and backup management</p>
        <div className="inline-block px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
          Coming in Module 12
        </div>
      </div>
    </div>
  );
};

export default CloudStorage;
