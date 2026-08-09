import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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
    <div className="min-h-screen flex bg-white dark:bg-dark-950">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 mb-8">
            <FiArrowLeft />
            Back to home
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-dark-600 dark:text-dark-400">Sign in to your BlockDocs account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required disabled={loading} placeholder="Enter your password" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <FiArrowRight /></>
              )}
            </button>
            <p className="text-center text-sm text-dark-600 dark:text-dark-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Create account</Link>
            </p>
          </form>
        </motion.div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative text-center text-white p-12 max-w-lg">
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-2xl">
            <FiLock className="text-4xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Secure by Design</h2>
          <p className="text-white/90 text-lg leading-relaxed">Your documents are encrypted client-side before leaving your device.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
