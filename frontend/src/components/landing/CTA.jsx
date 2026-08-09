import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="py-24 bg-white dark:bg-dark-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-lg mb-6 shadow-xl">
              <FiShield className="text-4xl text-white" />
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Secure Your Documents
              <br />
              Today
            </h2>

            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Join thousands of users who trust BlockDocs for their most sensitive documents. Start free, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary-700 font-bold rounded-lg hover:bg-dark-50 transition-all flex items-center gap-2 group shadow-xl"
              >
                Get Started Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              >
                Explore Features
              </a>
            </div>

            <p className="mt-8 text-sm text-white/70">
              Free forever plan � No credit card � Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
