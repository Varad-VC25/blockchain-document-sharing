import { motion } from "framer-motion";
import { FiBriefcase, FiHeart, FiBook, FiHome, FiCode, FiAward } from "react-icons/fi";

const UseCases = () => {
  const cases = [
    { icon: FiBriefcase, title: "Legal & Business", desc: "Contracts, NDAs, business agreements with verifiable timestamps." },
    { icon: FiHeart, title: "Healthcare", desc: "Patient records secured with encryption and access control." },
    { icon: FiBook, title: "Education", desc: "Diplomas, certificates, and academic records with blockchain proof." },
    { icon: FiHome, title: "Real Estate", desc: "Property deeds, contracts, and ownership documents." },
    { icon: FiCode, title: "Software & IP", desc: "Source code, patents, and intellectual property protection." },
    { icon: FiAward, title: "Certifications", desc: "Verifiable credentials that cannot be forged or altered." },
  ];

  return (
    <section id="use-cases" className="py-24 bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold mb-4">
            USE CASES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Trusted Across
            <br />
            <span className="gradient-text">Every Industry</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-dark-50 to-white dark:from-dark-900 dark:to-dark-950 border border-dark-200 dark:border-dark-800 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <useCase.icon className="text-2xl text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-dark-600 dark:text-dark-400">
                {useCase.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
