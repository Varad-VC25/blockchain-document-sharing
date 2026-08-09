import { FiUpload, FiShare2, FiCheckCircle, FiCloud } from "react-icons/fi";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    { icon: FiUpload, label: "Upload Document", desc: "Encrypt and store", path: "/upload", color: "from-primary-500 to-blue-600" },
    { icon: FiShare2, label: "Share Document", desc: "With wallet address", path: "/documents", color: "from-purple-500 to-pink-600" },
    { icon: FiCheckCircle, label: "Verify Document", desc: "Check integrity", path: "/verify", color: "from-green-500 to-emerald-600" },
    { icon: FiCloud, label: "Cloud Backup", desc: "Manage storage", path: "/cloud-storage", color: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
      <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="group relative p-4 rounded-xl bg-dark-50 dark:bg-dark-800 hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden"
          >
            <div className={"absolute inset-0 bg-gradient-to-br " + action.color + " opacity-0 group-hover:opacity-100 transition-opacity"}></div>
            <div className="relative">
              <div className={"w-10 h-10 rounded-lg bg-gradient-to-br " + action.color + " flex items-center justify-center mb-3 shadow-md"}>
                <action.icon className="text-white text-xl" />
              </div>
              <p className="text-sm font-bold text-dark-900 dark:text-white group-hover:text-white transition-colors">{action.label}</p>
              <p className="text-xs text-dark-500 group-hover:text-white/80 transition-colors">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
