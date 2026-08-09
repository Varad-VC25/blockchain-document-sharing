import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
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
    <div className="min-h-screen flex bg-white dark:bg-dark-950">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative text-white p-12 max-w-lg">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Join the Future of Document Security</h2>
          <p className="text-white/90 text-lg mb-10">Create your free account and start securing documents with blockchain technology.</p>
          <div className="space-y-4">
            {["Free forever, no credit card","AES-256 encryption","IPFS storage","Blockchain verification","Audit trail"].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <FiCheck className="text-sm" />
                </div>
                <span className="text-white/95">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 mb-6">
            <FiArrowLeft />
            Back to home
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Create account</h1>
            <p className="text-dark-600 dark:text-dark-400">Start securing your documents today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required disabled={loading} placeholder="John Doe" className="input-field pl-11" />
              </div>
            </div>
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
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required disabled={loading} placeholder="Create password" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: "length", label: "8+ characters" },
                    { key: "uppercase", label: "Uppercase" },
                    { key: "lowercase", label: "Lowercase" },
                    { key: "number", label: "Number" },
                  ].map((req) => (
                    <div key={req.key} className={"flex items-center gap-1.5 " + (passwordChecks[req.key] ? "text-green-600" : "text-dark-400")}>
                      <FiCheck className={passwordChecks[req.key] ? "opacity-100" : "opacity-30"} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} placeholder="Confirm password" className="input-field pl-11" />
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" required className="mt-0.5 rounded text-primary-600" />
              <span className="text-dark-600 dark:text-dark-400">I agree to the Terms of Service and Privacy Policy</span>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Account <FiArrowRight /></>
              )}
            </button>
            <p className="text-center text-sm text-dark-600 dark:text-dark-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
