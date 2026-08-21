import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay, FiShield, FiLock, FiCloud, FiZap, FiCheckCircle } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-hero-gradient bg-grid-pattern" />

      {/* Floating gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="text-center">
          {/* Clean Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-dark-800/50 backdrop-blur-lg border border-dark-200 dark:border-dark-700 mb-8 shadow-lg"
          >
            <FiShield className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
              Next-Gen Document Security Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tighter leading-none"
          >
            <span className="block text-dark-900 dark:text-white">Secure Your Docs</span>
            <span className="block gradient-text mt-2">Beyond Boundaries</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-dark-600 dark:text-dark-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Experience the future of document management with{" "}
            <strong className="text-dark-900 dark:text-white">military-grade encryption</strong>,{" "}
            <strong className="text-dark-900 dark:text-white">decentralized storage</strong>, and{" "}
            <strong className="text-dark-900 dark:text-white">blockchain verification</strong>. Your files, your control.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <span className="relative z-10">Get Started Free</span>
              <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-dark-800 text-dark-900 dark:text-white font-semibold border-2 border-dark-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-lg">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiPlay className="text-primary-600 dark:text-primary-400 ml-0.5 text-sm" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
          >
            {[
              { icon: FiShield, text: "AES-256 Encryption", color: "from-blue-500 to-cyan-500" },
              { icon: FiLock, text: "Zero Knowledge", color: "from-purple-500 to-pink-500" },
              { icon: FiCloud, text: "Decentralized", color: "from-green-500 to-emerald-500" },
              { icon: FiZap, text: "Lightning Fast", color: "from-orange-500 to-red-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border border-dark-200 dark:border-dark-700 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div className={"w-6 h-6 rounded-full bg-gradient-to-br " + item.color + " flex items-center justify-center"}>
                  <item.icon className="text-white text-sm" />
                </div>
                <span className="text-sm font-semibold text-dark-700 dark:text-dark-300">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-20 max-w-5xl mx-auto"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>

          <div className="relative glass rounded-2xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-dark-900 rounded-xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4 h-6 bg-white dark:bg-dark-800 rounded flex items-center px-3">
                  <FiLock className="text-green-500 text-xs mr-2" />
                  <span className="text-xs text-dark-500">blockdocs.app/dashboard</span>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="p-8 bg-gradient-to-br from-white to-dark-50 dark:from-dark-900 dark:to-dark-950">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Documents", value: "1,247", change: "+12%", color: "from-blue-500 to-cyan-500" },
                    { label: "Shared", value: "342", change: "+8%", color: "from-purple-500 to-pink-500" },
                    { label: "IPFS Storage", value: "8.2 GB", change: "+24%", color: "from-green-500 to-emerald-500" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="p-5 rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={"w-10 h-10 rounded-lg bg-gradient-to-br " + stat.color + " flex items-center justify-center shadow-md"}>
                          <FiCheckCircle className="text-white text-sm" />
                        </div>
                        <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                      </div>
                      <p className="text-xs text-dark-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-dark-900 dark:text-white">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
