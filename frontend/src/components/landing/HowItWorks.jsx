import { motion } from "framer-motion";
import { FiUpload, FiLock, FiCloud, FiCheckCircle, FiShare2 } from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      icon: FiUpload,
      title: "Upload Your Document",
      desc: "Drag and drop or select any file. We support PDF, DOCX, images, and more.",
      color: "bg-blue-500",
    },
    {
      icon: FiLock,
      title: "AES-256 Encryption",
      desc: "Your file is encrypted with military-grade AES-256 encryption before leaving your device.",
      color: "bg-purple-500",
    },
    {
      icon: FiCloud,
      title: "Hybrid Storage",
      desc: "Encrypted file is uploaded to IPFS (primary) and Cloudinary (backup) simultaneously.",
      color: "bg-green-500",
    },
    {
      icon: FiCheckCircle,
      title: "Blockchain Registration",
      desc: "SHA-256 hash and metadata are stored on Ethereum for tamper-proof verification.",
      color: "bg-orange-500",
    },
    {
      icon: FiShare2,
      title: "Share Securely",
      desc: "Grant access to specific wallet addresses. Recipients decrypt only with permission.",
      color: "bg-pink-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-dark-50 dark:bg-dark-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Five Simple Steps to
            <br />
            <span className="gradient-text">Unbreakable Security</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-purple-500 to-pink-500 md:-translate-x-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-start gap-6 mb-12 md:mb-16 md:justify-${index % 2 === 0 ? "start" : "end"} md:pr-${index % 2 === 0 ? "0" : "8"} md:pl-${index % 2 === 0 ? "8" : "0"}`}
            >
              {/* Icon Circle */}
              <div className={`absolute left-8 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-xl z-10`}>
                <step.icon className="text-2xl text-white" />
              </div>

              {/* Content Card */}
              <div className={`ml-24 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-16" : "md:ml-auto md:pl-16"}`}>
                <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg border border-dark-200 dark:border-dark-700 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-dark-400">STEP {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
