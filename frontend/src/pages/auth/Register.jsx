import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiCheck, FiSun, FiMoon, FiShield, FiZap, FiCloud, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!Object.values(passwordChecks).every(Boolean)) {
      toast.error("Password does not meet all requirements");
      return;
    }
    setLoading(true);
    try {
      await register(formData.fullName, formData.email, formData.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border border-dark-200 dark:border-dark-700 hover:scale-110 transition-all shadow-lg"
      >
        {isDark ? <FiSun className="text-yellow-500 text-xl" /> : <FiMoon className="text-primary-600 text-xl" />}
      </button>

      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />

        <div className="relative flex flex-col justify-center items-center text-white p-12 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight tracking-tight">
              Join the Future of
              <br />
              <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Document Security</span>
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Create your free account and experience next-generation document management.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: FiShield, text: "Military-grade AES-256 encryption" },
                { icon: FiCloud, text: "Decentralized IPFS storage" },
                { icon: FiZap, text: "Instant blockchain verification" },
                { icon: FiUsers, text: "Secure sharing with any wallet" },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="text-lg" />
                  </div>
                  <span className="text-white/95 text-base">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20"
            >
              <div className="text-center">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-white/70">Free Forever</p>
              </div>
              <div className="text-center border-x border-white/20">
                <p className="text-2xl font-bold">50MB</p>
                <p className="text-xs text-white/70">Per File</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-white/70">Documents</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-4 lg:px-12 lg:py-6 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 mb-3 transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="mb-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/30">
                <FiLock className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold gradient-text">BlockDocs</span>
            </Link>

            <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-1 tracking-tight">
              Create account
            </h1>
            <p className="text-dark-500 dark:text-dark-400">
              Start securing your documents today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-2.5 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">
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
                  className="w-full pl-12 pr-4 py-2.5 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Create password"
                  className="w-full pl-12 pr-12 py-2.5 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={"h-1.5 flex-1 rounded-full transition-colors " +
                          (i <= passwordStrength
                            ? passwordStrength === 4 ? "bg-green-500" : passwordStrength === 3 ? "bg-yellow-500" : passwordStrength === 2 ? "bg-orange-500" : "bg-red-500"
                            : "bg-dark-200 dark:bg-dark-700")}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    {[
                      { key: "length", label: "8+ chars" },
                      { key: "uppercase", label: "Upper" },
                      { key: "lowercase", label: "Lower" },
                      { key: "number", label: "Number" },
                    ].map((req) => (
                      <div key={req.key} className={"flex items-center gap-1 " + (passwordChecks[req.key] ? "text-green-600 dark:text-green-400" : "text-dark-400")}>
                        <FiCheck className={passwordChecks[req.key] ? "opacity-100" : "opacity-30"} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-4 py-2.5 bg-dark-50 dark:bg-dark-900 border-2 border-transparent focus:border-primary-500 rounded-xl text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none transition-all"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                  <FiCheck /> Passwords match
                </p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded text-primary-600" />
              <span className="text-dark-600 dark:text-dark-400">
                I agree to <a href="#" className="text-primary-600 font-semibold hover:underline">Terms</a> and <a href="#" className="text-primary-600 font-semibold hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-dark-200 dark:border-dark-800">
              <p className="text-dark-600 dark:text-dark-400 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
