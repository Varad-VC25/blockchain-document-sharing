import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiShield, FiLock, FiCloud, FiZap } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-hero-gradient bg-grid-pattern" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-200 dark:border-primary-800 mb-8"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">LIVE ON SEPOLIA</span>
            </div>
            <span className="text-xs text-dark-600 dark:text-dark-400">�</span>
            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">Powered by Ethereum & IPFS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tighter leading-none"
          >
            <span className="block text-dark-900 dark:text-white">Secure Your Docs</span>
            <span className="block gradient-text mt-2">On The Blockchain</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-dark-600 dark:text-dark-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            The world's most secure document sharing platform combining <strong className="text-dark-900 dark:text-white">AES-256 encryption</strong>, <strong className="text-dark-900 dark:text-white">IPFS decentralization</strong>, and <strong className="text-dark-900 dark:text-white">Ethereum blockchain</strong> for uncompromising security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 group">
              Start For Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2">
              <FiPlay className="text-primary-600" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm"
          >
            {[
              { icon: FiShield, text: "AES-256 Encryption" },
              { icon: FiLock, text: "Zero Knowledge" },
              { icon: FiCloud, text: "IPFS + Cloud Backup" },
              { icon: FiZap, text: "Instant Verification" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                <item.icon className="text-primary-600 dark:text-primary-400" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-20 max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-dark-900 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4 h-6 bg-dark-100 dark:bg-dark-800 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Documents", value: "1,247" },
                  { label: "Shared", value: "342" },
                  { label: "IPFS Storage", value: "8.2 GB" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg bg-dark-50 dark:bg-dark-800/50 border border-dark-200 dark:border-dark-700">
                    <p className="text-xs text-dark-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
