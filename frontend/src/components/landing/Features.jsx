import { motion } from "framer-motion";
import {
  FiShield, FiCloud, FiHash, FiUsers, FiLock, FiZap,
  FiEye, FiActivity, FiKey, FiArrowRight
} from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: FiShield,
      title: "AES-256 Encryption",
      desc: "Military-grade encryption ensures your documents are secured before they ever leave your device.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      icon: FiHash,
      title: "SHA-256 Integrity",
      desc: "Every document gets a cryptographic hash stored on blockchain to verify authenticity anytime.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    },
    {
      icon: FiCloud,
      title: "Hybrid Storage",
      desc: "IPFS decentralized storage with cloud backup for maximum reliability and availability.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      icon: FiKey,
      title: "Wallet Authentication",
      desc: "Connect your Web3 wallet for cryptographic identity verification and secure access.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    },
    {
      icon: FiUsers,
      title: "Selective Sharing",
      desc: "Share documents with specific addresses. Revoke access anytime with cryptographic proof.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
    },
    {
      icon: FiActivity,
      title: "Audit Trail",
      desc: "Complete tamper-proof history of every upload, share, download, and access modification.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    },
    {
      icon: FiEye,
      title: "Zero Knowledge",
      desc: "We never see your files. All encryption happens client-side before upload.",
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    },
    {
      icon: FiZap,
      title: "Instant Verification",
      desc: "Verify document integrity in seconds using blockchain-stored cryptographic proofs.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
    },
    {
      icon: FiLock,
      title: "Time-Limited Access",
      desc: "Set expiration dates on shared documents. Access automatically revokes after expiry.",
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/10 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold tracking-wider mb-4 uppercase">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Everything You Need
            <br />
            <span className="gradient-text">In One Platform</span>
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Enterprise-grade security combined with the best of decentralized technology
          </p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={"group relative p-6 rounded-2xl bg-gradient-to-br " + feature.bgColor + " border border-dark-200 dark:border-dark-800 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"}
            >
              {/* Hover gradient overlay */}
              <div className={"absolute inset-0 bg-gradient-to-br " + feature.color + " opacity-0 group-hover:opacity-100 transition-opacity duration-300"}></div>

              <div className="relative z-10">
                <div className={"w-14 h-14 rounded-xl bg-gradient-to-br " + feature.color + " flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white group-hover:text-white mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 group-hover:text-white/90 leading-relaxed mb-4 transition-colors">
                  {feature.desc}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors">
                  Learn more
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
