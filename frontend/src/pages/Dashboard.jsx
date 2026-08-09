import { FiFileText, FiShare2, FiCloud, FiActivity, FiUsers, FiDownload } from "react-icons/fi";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@context/AuthContext";
import StatCard from "@components/dashboard/StatCard";
import ActivityFeed from "@components/dashboard/ActivityFeed";
import QuickActions from "@components/dashboard/QuickActions";
import StatusWidget from "@components/dashboard/StatusWidget";

const chartData = [
  { day: "Mon", uploads: 0, shares: 0 },
  { day: "Tue", uploads: 0, shares: 0 },
  { day: "Wed", uploads: 0, shares: 0 },
  { day: "Thu", uploads: 0, shares: 0 },
  { day: "Fri", uploads: 0, shares: 0 },
  { day: "Sat", uploads: 0, shares: 0 },
  { day: "Sun", uploads: 0, shares: 0 },
];

const storageData = [
  { name: "Used", value: 0 },
  { name: "Available", value: 100 },
];

const COLORS = ["#3b82f6", "#e5e7eb"];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <p className="text-white/80 text-sm mb-2">Welcome back</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{user?.fullName}</h1>
          <p className="text-white/90 max-w-2xl">Your secure document dashboard. Track uploads, manage shares, and monitor blockchain activity all in one place.</p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              All systems operational
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm">
              Sepolia Testnet
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard icon={FiFileText} label="Total Documents" value="0" trend="up" trendValue="0%" color="primary" subtext="Module 11" />
        <StatCard icon={FiShare2} label="Documents Shared" value="0" color="purple" subtext="Module 17" />
        <StatCard icon={FiCloud} label="Cloud Storage" value="0 MB" color="green" subtext="Module 12" />
        <StatCard icon={FiActivity} label="Blockchain TX" value="0" color="orange" subtext="Module 16" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-dark-900 dark:text-white">Activity Overview</h3>
              <p className="text-sm text-dark-500">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary-500"></div><span className="text-dark-500">Uploads</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500"></div><span className="text-dark-500">Shares</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="uploads" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="shares" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white">Storage Usage</h3>
            <p className="text-sm text-dark-500">IPFS + Cloud backup</p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={storageData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                  {storageData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-dark-900 dark:text-white">0%</span>
              <span className="text-xs text-dark-500">of 100MB</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-500">Used</span>
              <span className="font-semibold text-dark-900 dark:text-white">0 MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-500">Available</span>
              <span className="font-semibold text-dark-900 dark:text-white">100 MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ActivityFeed /></div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusWidget />
        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FiUsers className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Coming Up Next</h3>
              <p className="text-white/80 text-sm">Module 8 & 9</p>
            </div>
          </div>
          <p className="text-white/90 mb-4 text-sm">Beautiful drag-drop upload UI and complete My Documents page with grid/list view, filters, and search.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium">Drag & Drop</span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium">Grid View</span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium">Filters</span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium">Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
