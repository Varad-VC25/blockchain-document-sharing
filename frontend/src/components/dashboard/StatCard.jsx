import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color = "primary", subtext }) => {
  const colorClasses = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + colorClasses[color]}>
          <Icon className="text-2xl" />
        </div>
        {trend && (
          <div className={"flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold " + (trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>
            {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-sm text-dark-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-dark-900 dark:text-white">{value}</p>
      {subtext && <p className="text-xs text-dark-400 mt-2">{subtext}</p>}
    </div>
  );
};

export default StatCard;
