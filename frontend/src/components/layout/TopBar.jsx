import { useState } from "react";
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon, FiLogOut, FiUser, FiHome, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";
import { toast } from "react-toastify";
import WalletConnect from "@components/wallet/WalletConnect";

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800">
      <div className="h-16 flex items-center justify-between px-4 lg:px-6 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800">
            <FiMenu className="text-xl" />
          </button>
          <div className="relative hidden md:block flex-1 max-w-lg">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search documents, wallets, tags..."
              className="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-800 border border-transparent focus:border-primary-500 rounded-lg text-sm focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <WalletConnect compact={true} />
          </div>

          <button onClick={() => navigate("/")} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-sm text-dark-600 dark:text-dark-400 transition-colors">
            <FiHome />
            <span className="hidden md:inline">Home</span>
          </button>

          <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors">
            {isDark ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-primary-600" />}
          </button>

          <button className="relative p-2.5 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors">
            <FiBell className="text-dark-600 dark:text-dark-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-dark-900 dark:text-white leading-tight">{user?.fullName}</p>
                <p className="text-xs text-dark-500 leading-tight">{user?.email}</p>
              </div>
              <FiChevronDown className={"text-dark-400 transition-transform hidden md:block " + (dropdownOpen ? "rotate-180" : "")} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-dark-100 dark:border-dark-800">
                    <p className="font-semibold text-dark-900 dark:text-white">{user?.fullName}</p>
                    <p className="text-xs text-dark-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <button onClick={() => { navigate("/profile"); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-dark-50 dark:hover:bg-dark-800 text-sm text-dark-700 dark:text-dark-300">
                      <FiUser /> Profile Settings
                    </button>
                    <button onClick={() => { navigate("/"); setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-dark-50 dark:hover:bg-dark-800 text-sm text-dark-700 dark:text-dark-300">
                      <FiHome /> Go to Home
                    </button>
                  </div>
                  <div className="p-2 border-t border-dark-100 dark:border-dark-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
