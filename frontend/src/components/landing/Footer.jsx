import { Link } from "react-router-dom";
import { FiLock, FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";
import { APP_CONFIG } from "@config/constants";

const Footer = () => {
  const links = {
    Product: ["Features", "Security", "Pricing", "Roadmap", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press", "Contact"],
    Resources: ["Documentation", "API Reference", "Tutorials", "Whitepaper", "Support"],
    Legal: ["Privacy", "Terms", "Cookies", "GDPR", "Licenses"],
  };

  return (
    <footer className="bg-dark-950 text-white pt-20 pb-8 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">

          {/* Logo & Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <FiLock className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">{APP_CONFIG.NAME}</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed mb-6">
              The world's most secure document sharing platform, powered by blockchain, IPFS, and military-grade encryption.
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold mb-4 text-white">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-dark-400 text-sm hover:text-primary-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            {APP_CONFIG.COPYRIGHT}
          </p>
          <div className="flex items-center gap-6 text-sm text-dark-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All systems operational</span>
            </div>
            <span>�</span>
            <span>Built with Web3</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
