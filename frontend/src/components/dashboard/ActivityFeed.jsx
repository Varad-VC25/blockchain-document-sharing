import { FiUpload, FiShare2, FiDownload, FiCheckCircle, FiUserPlus, FiActivity } from "react-icons/fi";

const ActivityFeed = () => {
  const activities = [
    { type: "REGISTER", icon: FiUserPlus, color: "green", title: "Account Created", desc: "Welcome to BlockDocs!", time: "Just now" },
    { type: "LOGIN", icon: FiCheckCircle, color: "blue", title: "Login Successful", desc: "You logged in successfully", time: "1 min ago" },
    { type: "PENDING", icon: FiUpload, color: "gray", title: "Upload Documents", desc: "Ready for upload", time: "Coming soon" },
    { type: "PENDING", icon: FiShare2, color: "gray", title: "Share Documents", desc: "Ready to share", time: "Coming soon" },
    { type: "PENDING", icon: FiDownload, color: "gray", title: "Download Verified", desc: "Coming soon", time: "Coming soon" },
  ];

  const colorClasses = {
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    gray: "bg-dark-100 dark:bg-dark-800 text-dark-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiActivity className="text-primary-600" />
          <h3 className="text-lg font-bold text-dark-900 dark:text-white">Recent Activity</h3>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</button>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">
            <div className={"w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " + colorClasses[activity.color]}>
              <activity.icon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{activity.title}</p>
              <p className="text-xs text-dark-500 truncate">{activity.desc}</p>
            </div>
            <span className="text-xs text-dark-400 whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
