import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechCorp",
      avatar: "SC",
      color: "from-blue-500 to-cyan-500",
      quote: "BlockDocs revolutionized how we handle sensitive contracts. The blockchain verification alone saves us hours of manual checking every week.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Legal Director, LawFirm",
      avatar: "MR",
      color: "from-purple-500 to-pink-500",
      quote: "The tamper-proof audit trail is a game changer for legal documents. Our clients love knowing their files are cryptographically secured.",
    },
    {
      name: "Dr. Priya Sharma",
      role: "Chief Medical Officer",
      avatar: "PS",
      color: "from-green-500 to-emerald-500",
      quote: "HIPAA compliance made simple. Patient records stored on IPFS with blockchain permissions is exactly what healthcare needed.",
    },
    {
      name: "James Wilson",
      role: "Blockchain Developer",
      avatar: "JW",
      color: "from-orange-500 to-red-500",
      quote: "Finally, a document platform that speaks Web3. The MetaMask integration is seamless and the smart contract is beautifully written.",
    },
    {
      name: "Elena Kowalski",
      role: "University Registrar",
      avatar: "EK",
      color: "from-indigo-500 to-blue-500",
      quote: "We issue diplomas via BlockDocs. Employers can verify authenticity instantly. Zero fraud since implementation.",
    },
    {
      name: "Ahmed Hassan",
      role: "Real Estate Manager",
      avatar: "AH",
      color: "from-yellow-500 to-orange-500",
      quote: "Property deeds on blockchain? Yes please. BlockDocs made our closing process 10x faster with immutable records.",
    },
  ];

  return (
    <section className="py-24 bg-dark-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Loved by Teams
            <br />
            <span className="gradient-text">Worldwide</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-dark-700 dark:text-dark-300 mb-6 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-dark-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-dark-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
