import { motion } from "framer-motion";
import { FiCheck, FiLock, FiHash, FiCloud, FiDatabase, FiLink } from "react-icons/fi";

const UploadWorkflow = ({ currentStep = 0 }) => {
  const steps = [
    { id: 1, label: "Encrypt", icon: FiLock, desc: "AES-256 encryption", color: "from-blue-500 to-cyan-500" },
    { id: 2, label: "Hash", icon: FiHash, desc: "SHA-256 integrity", color: "from-purple-500 to-pink-500" },
    { id: 3, label: "IPFS", icon: FiCloud, desc: "Decentralized storage", color: "from-green-500 to-emerald-500" },
    { id: 4, label: "Cloud", icon: FiDatabase, desc: "Cloudinary backup", color: "from-orange-500 to-red-500" },
    { id: 5, label: "Blockchain", icon: FiLink, desc: "Ethereum registration", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
      <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Upload Workflow</h3>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-200 dark:bg-dark-700">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-500 to-purple-500"
            initial={{ height: "0%" }}
            animate={{ height: (currentStep / steps.length) * 100 + "%" }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index + 1;
            const isPending = currentStep < index + 1;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4 pl-2"
              >
                <div className={"relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-all " +
                  (isCompleted ? "bg-gradient-to-br from-green-500 to-emerald-500" :
                  isCurrent ? "bg-gradient-to-br " + step.color + " animate-pulse" :
                  "bg-dark-200 dark:bg-dark-700")}>
                  {isCompleted ? (
                    <FiCheck className="text-white text-xl" />
                  ) : (
                    <step.icon className={"text-xl " + (isPending ? "text-dark-400" : "text-white")} />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className={"font-semibold " + (isPending ? "text-dark-400" : "text-dark-900 dark:text-white")}>
                    {step.label}
                  </p>
                  <p className={"text-sm " + (isPending ? "text-dark-400" : "text-dark-500")}>
                    {step.desc}
                  </p>
                </div>
                {isCurrent && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Processing
                  </div>
                )}
                {isCompleted && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                    <FiCheck />
                    Done
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UploadWorkflow;
