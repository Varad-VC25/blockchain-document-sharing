import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import { APP_CONFIG } from "@config/constants";

const Navbar = () => {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={"fixed top-0 w-full z-50 transition-all duration-300 " + (isScrolled ? "glass shadow-lg" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
              <FiLock className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold gradient-text">{APP_CONFIG.NAME}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors">
              {isDark ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-primary-600" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium shadow-lg shadow-primary-500/30">
                  <FiUser />
                  Dashboard
                </Link>
                <button onClick={logout} className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors text-sm font-medium">
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-primary-600 transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="hidden md:inline-flex btn-primary text-sm py-2">
                  Get Started
                </Link>
              </>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-dark-100 dark:bg-dark-800">
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-200 dark:border-dark-800 animate-slide-down">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg">
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 mt-3 px-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="btn-primary flex-1 text-center text-sm py-2">Dashboard</Link>
                    <button onClick={logout} className="btn-secondary flex-1 text-center text-sm py-2">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2">Sign In</Link>
                    <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
