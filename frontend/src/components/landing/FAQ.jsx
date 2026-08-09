import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How is my document actually secured?",
      a: "Every document is encrypted with AES-256 (military-grade encryption) on your device before uploading. The encrypted file is stored on IPFS and Cloudinary. A SHA-256 hash and metadata are recorded on the Ethereum blockchain, making it tamper-proof and verifiable.",
    },
    {
      q: "Can BlockDocs employees see my files?",
      a: "No. We use zero-knowledge architecture. Encryption happens client-side, and we never have access to your encryption keys. Even if our servers were compromised, your documents would remain encrypted and unreadable.",
    },
    {
      q: "What happens if IPFS goes down?",
      a: "Every file is also backed up on Cloudinary. If IPFS is temporarily unavailable, your documents automatically retrieve from Cloudinary backup. You get true redundancy with hybrid storage.",
    },
    {
      q: "How do I share a document with someone?",
      a: "Simply enter the recipient's Ethereum wallet address. Access permissions are recorded on the smart contract. Only wallets you explicitly grant can decrypt and view documents. You can revoke access anytime.",
    },
    {
      q: "Do I need cryptocurrency to use BlockDocs?",
      a: "You need a MetaMask wallet, but only pay small gas fees when performing blockchain operations (sharing, revoking access). We use Sepolia testnet for demo, where fees are free.",
    },
    {
      q: "How do I verify a document's authenticity?",
      a: "Every document has a SHA-256 hash stored on blockchain. Use our verification tool or Etherscan to confirm the hash matches. If it matches, the document is authentic and untampered.",
    },
    {
      q: "Is there a file size limit?",
      a: "Yes, currently 50MB per file for free users. Premium plans support larger files up to 5GB.",
    },
    {
      q: "What file types are supported?",
      a: "All major formats: PDF, DOCX, XLSX, PPTX, images (PNG, JPG, GIF), text files, and more. If it's a file, we can secure it.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 tracking-tight">
            Got Questions?
            <br />
            <span className="gradient-text">We Have Answers</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="border border-dark-200 dark:border-dark-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
              >
                <span className="font-semibold text-dark-900 dark:text-white pr-8">
                  {faq.q}
                </span>
                <FiChevronDown className={`text-primary-600 dark:text-primary-400 text-xl transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-dark-600 dark:text-dark-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
