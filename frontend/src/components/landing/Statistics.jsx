import { motion } from "framer-motion";
import { FiFileText, FiUsers, FiShield, FiZap } from "react-icons/fi";

const Statistics = () => {
  const stats = [
    { icon: FiFileText, value: "50K+", label: "Documents Secured", color: "text-blue-500" },
    { icon: FiUsers, value: "10K+", label: "Active Users", color: "text-purple-500" },
    { icon: FiShield, value: "100%", label: "Uptime Guaranteed", color: "text-green-500" },
    { icon: FiZap, value: "<2s", label: "Verification Speed", color: "text-orange-500" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg mb-4 shadow-xl">
                <stat.icon className="text-3xl text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
