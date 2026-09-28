import { FiDatabase, FiCloud, FiLink } from "react-icons/fi";

const StatusWidget = () => {
  const services = [
    { name: "MongoDB Atlas", status: "operational", desc: "Database connected", icon: FiDatabase },
    { name: "IPFS Network", status: "operational", desc: "Decentralized storage", icon: FiCloud },
    { name: "Cloudinary", status: "operational", desc: "Encrypted cloud backup", icon: FiCloud },
    { name: "Ethereum Network", status: "operational", desc: "Smart contract ready", icon: FiLink },
  ];

  const statusConfig = {
    operational: { color: "bg-green-500", label: "Operational", text: "text-green-600 dark:text-green-400" },
    pending: { color: "bg-yellow-500", label: "Pending", text: "text-yellow-600 dark:text-yellow-400" },
    down: { color: "bg-red-500", label: "Down", text: "text-red-600 dark:text-red-400" },
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-dark-900 dark:text-white">System Status</h3>
        <span className="text-xs text-dark-400">Live</span>
      </div>
      <div className="space-y-3">
        {services.map((service, index) => {
          const config = statusConfig[service.status];
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dark-50 dark:bg-dark-800/50">
              <div className="flex items-center gap-3">
                <service.icon className="text-lg text-dark-400" />
                <div>
                  <p className="text-sm font-semibold text-dark-900 dark:text-white">{service.name}</p>
                  <p className="text-xs text-dark-500">{service.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={"w-2 h-2 rounded-full " + config.color + (service.status === "operational" ? " animate-pulse" : "")}></div>
                <span className={"text-xs font-medium " + config.text}>{config.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusWidget;
