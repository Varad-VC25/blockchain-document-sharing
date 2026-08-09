import { FiLogOut, FiUser, FiLock, FiCheckCircle, FiSun, FiMoon, FiShield, FiCloud, FiDatabase, FiFileText, FiShare2, FiActivity, FiHome } from "react-icons/fi";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <nav className="bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo - Clickable to go home */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FiLock className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold gradient-text">BlockDocs</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* Home Button */}
              <Link
                to="/"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors text-sm font-medium text-dark-700 dark:text-dark-300"
                title="Go to Home"
              >
                <FiHome />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors">
                {isDark ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-primary-600" />}
              </button>

              {/* User Info */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-100 dark:bg-dark-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-dark-700 dark:text-dark-300">{user?.fullName}</span>
              </div>

              {/* Logout Button */}
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors text-sm font-medium">
                <FiLogOut />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <FiCheckCircle className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}!</h1>
              <p className="text-white/90 mt-1">Your BlockDocs dashboard is ready</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <FiFileText className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-dark-500 mb-1">Total Documents</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0</p>
            <p className="text-xs text-dark-400 mt-2">Coming in Module 11</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <FiShare2 className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-dark-500 mb-1">Shared</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0</p>
            <p className="text-xs text-dark-400 mt-2">Coming in Module 17</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <FiCloud className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-dark-500 mb-1">Cloud Storage</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0 MB</p>
            <p className="text-xs text-dark-400 mt-2">Coming in Module 12</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <FiActivity className="text-2xl text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-dark-500 mb-1">Blockchain TX</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0</p>
            <p className="text-xs text-dark-400 mt-2">Coming in Module 16</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FiUser className="text-xl text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white">Account Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-800">
                <span className="text-dark-500 text-sm font-medium">Full Name</span>
                <span className="font-semibold text-dark-900 dark:text-white">{user?.fullName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-800">
                <span className="text-dark-500 text-sm font-medium">Email</span>
                <span className="font-semibold text-dark-900 dark:text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-800">
                <span className="text-dark-500 text-sm font-medium">Role</span>
                <span className="badge badge-info uppercase">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-800">
                <span className="text-dark-500 text-sm font-medium">Status</span>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dark-100 dark:border-dark-800">
                <span className="text-dark-500 text-sm font-medium">Wallet</span>
                <span className="text-xs text-dark-400 italic">Not connected</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-dark-500 text-sm font-medium">Member Since</span>
                <span className="font-medium text-dark-900 dark:text-white text-sm">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiShield className="text-xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white">Security</h3>
            </div>
            <ul className="space-y-3">
              {["JWT Token Auth","bcrypt Hashing","Rate Limiting","Input Validation","XSS Protection","CORS Enabled"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300">
                  <FiCheckCircle className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coming Next Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <FiDatabase className="text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Coming Up Next</h3>
              <p className="text-white/90 text-sm">Module 7: Professional Dashboard with sidebar navigation, charts, cloud storage integration, and activity feed.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
