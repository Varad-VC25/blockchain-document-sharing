import { motion } from "framer-motion";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

const UploadProgress = ({ progress = 0, status = "idle" }) => {
  return (
    <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {status === "complete" ? (
            <FiCheckCircle className="text-green-500 text-xl" />
          ) : (
            <FiLoader className="text-primary-500 text-xl animate-spin" />
          )}
          <span className="font-semibold text-dark-900 dark:text-white text-sm">
            {status === "complete" ? "Upload complete" : "Uploading..."}
          </span>
        </div>
        <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-3 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: progress + "%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;
