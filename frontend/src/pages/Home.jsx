import { FiSun, FiMoon, FiCheckCircle, FiLock, FiCloud, FiHash } from "react-icons/fi";
import { useTheme } from "@context/ThemeContext";
import { APP_CONFIG } from "@config/constants";

const Home = () => {
  const { toggleTheme, isDark } = useTheme();

  const features = [
    { icon: FiLock, title: "AES-256 Encryption", desc: "Military-grade encryption for every file" },
    { icon: FiHash, title: "SHA-256 Integrity", desc: "Cryptographic hash verification" },
    { icon: FiCloud, title: "Hybrid Storage", desc: "IPFS + Cloudinary backup" },
    { icon: FiCheckCircle, title: "Blockchain Verified", desc: "Ethereum smart contract security" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors">
      <nav className="sticky top-0 z-50 glass border-b border-dark-200 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <FiLock className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold gradient-text">{APP_CONFIG.NAME}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            >
              {isDark ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-primary-600" />}
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-hero-gradient bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Module 4 - Setup Complete
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="gradient-text">Secure Documents</span>
              <br />
              <span className="text-dark-900 dark:text-white">On The Blockchain</span>
            </h1>
            <p className="text-lg md:text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto mb-10">
              {APP_CONFIG.DESCRIPTION}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-primary text-lg px-8 py-3">Get Started Free</button>
              <button className="btn-outline text-lg px-8 py-3">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Why Choose BlockDocs?
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Enterprise-grade security meets decentralized storage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card-hover p-6 animate-slide-up" style={{ animationDelay: index * 100 + "ms" }}>
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="text-2xl text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6 flex items-center gap-2">
              <FiCheckCircle className="text-green-500" />
              Setup Verification
            </h3>
            <div className="space-y-3">
              {[
                "React 18",
                "Vite Dev Server",
                "Tailwind CSS",
                "Dark Mode Support",
                "React Router",
                "React Icons",
                "Toast Notifications",
                "Framer Motion",
                "Custom Theme",
                "Path Aliases",
              ].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-dark-100 dark:bg-dark-800">
                  <span className="text-dark-700 dark:text-dark-300 font-medium">{label}</span>
                  <FiCheckCircle className="text-green-500 text-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-dark-200 dark:border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-dark-500 dark:text-dark-500 text-sm">{APP_CONFIG.COPYRIGHT}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
