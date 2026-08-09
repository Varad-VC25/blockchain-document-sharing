import { NavLink } from "react-router-dom";
import { FiHome, FiFileText, FiUpload, FiShare2, FiCloud, FiActivity, FiCheckCircle, FiUser, FiLock, FiX, FiChevronLeft } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/documents", icon: FiFileText, label: "My Documents" },
    { path: "/upload", icon: FiUpload, label: "Upload" },
    { path: "/shared-with-me", icon: FiShare2, label: "Shared" },
    { path: "/cloud-storage", icon: FiCloud, label: "Cloud Storage" },
    { path: "/audit-trail", icon: FiActivity, label: "Audit Trail" },
    { path: "/verify", icon: FiCheckCircle, label: "Verify Document" },
    { path: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={"fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 z-50 transition-all duration-300 flex flex-col " + (isCollapsed ? "w-20" : "w-64") + " " + (isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-200 dark:border-dark-800">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <FiLock className="text-white text-xl" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold gradient-text">BlockDocs</span>}
          </NavLink>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800">
            <FiX className="text-xl" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  end
                  className={({ isActive }) =>
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 " +
                    (isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white")
                  }
                  title={isCollapsed ? item.label : ""}
                >
                  <item.icon className="text-xl flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 border-t border-dark-200 dark:border-dark-800">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-500 text-sm"
          >
            <FiChevronLeft className={"transition-transform " + (isCollapsed ? "rotate-180" : "")} />
            {!isCollapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
