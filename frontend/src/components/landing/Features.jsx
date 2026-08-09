import { motion } from "framer-motion";
import {
  FiShield, FiCloud, FiHash, FiUsers, FiLock, FiZap,
  FiEye, FiActivity, FiKey
} from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: FiShield,
      title: "AES-256 Encryption",
      desc: "Military-grade encryption ensures your documents are secured before they ever leave your device.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiHash,
      title: "SHA-256 Integrity",
      desc: "Every document gets a cryptographic hash stored on blockchain to verify authenticity anytime.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiCloud,
      title: "Hybrid Storage",
      desc: "IPFS decentralized storage with Cloudinary backup for maximum reliability and availability.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FiKey,
      title: "Wallet Authentication",
      desc: "Connect your MetaMask wallet for cryptographic identity verification and blockchain access.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FiUsers,
      title: "Selective Sharing",
      desc: "Share documents with specific wallet addresses. Revoke access anytime with on-chain proof.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: FiActivity,
      title: "Audit Trail",
      desc: "Complete tamper-proof history of every upload, share, download, and access modification.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiEye,
      title: "Zero Knowledge",
      desc: "We never see your files. All encryption happens client-side before upload.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: FiZap,
      title: "Instant Verification",
      desc: "Verify document integrity in seconds using blockchain-stored cryptographic proofs.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: FiLock,
      title: "Time-Limited Access",
      desc: "Set expiration dates on shared documents. Access automatically revokes after expiry.",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-4">
            FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Everything You Need for
            <br />
            <span className="gradient-text">Secure Document Sharing</span>
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Powered by cutting-edge cryptography and decentralized technology
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
