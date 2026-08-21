import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiShield, FiCheckCircle, FiZap, FiCloud, FiSun, FiMoon } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border border-dark-200 dark:border-dark-700 hover:scale-110 transition-all shadow-lg"
      >
        {isDark ? <FiSun className="text-yellow-500 text-xl" /> : <FiMoon className="text-primary-600 text-xl" />}
      </button>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 mb-8 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/30">
                <FiLock className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">BlockDocs</span>
            </Link>

            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-dark-500 dark:text-dark-400">
              Sign in to access your secure documents
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300">
                  Password
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-primary-600" />
              <span className="text-sm text-dark-600 dark:text-dark-400">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-dark-200 dark:border-dark-800">
              <p className="text-dark-600 dark:text-dark-400 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />

        <div className="relative flex flex-col justify-center items-center text-white p-12 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg text-center"
          >
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-2xl border border-white/20">
                <FiShield className="text-5xl" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight">
              Secure. Verified.
              <br />
              Truly Yours.
            </h2>
            <p className="text-white/90 text-lg mb-10 leading-relaxed">
              Zero knowledge, maximum security. Your files stay yours.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FiShield, label: "AES-256", desc: "Encryption" },
                { icon: FiCheckCircle, label: "SHA-256", desc: "Integrity" },
                { icon: FiCloud, label: "IPFS", desc: "Storage" },
                { icon: FiZap, label: "Instant", desc: "Verification" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all cursor-default"
                >
                  <item.icon className="text-2xl mb-2 mx-auto" />
                  <p className="font-bold text-base">{item.label}</p>
                  <p className="text-xs text-white/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
