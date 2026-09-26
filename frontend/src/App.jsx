import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@context/ThemeContext";
import { AuthProvider } from "@context/AuthContext";
import { WalletProvider } from "@context/WalletContext";
import { TOAST_CONFIG } from "@config/constants";

import ProtectedRoute from "@components/common/ProtectedRoute";
import PublicRoute from "@components/common/PublicRoute";
import DashboardLayout from "@components/layout/DashboardLayout";

import Home from "@pages/Home";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import Dashboard from "@pages/Dashboard";
import Documents from "@pages/Documents";
import Upload from "@pages/Upload";
import SharedWithMe from "@pages/SharedWithMe";
import CloudStorage from "@pages/CloudStorage";
import AuditTrail from "@pages/AuditTrail";
import VerifyDocument from "@pages/VerifyDocument";
import Profile from "@pages/Profile";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected routes with dashboard layout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/shared-with-me" element={<SharedWithMe />} />
              <Route path="/cloud-storage" element={<CloudStorage />} />
              <Route path="/audit-trail" element={<AuditTrail />} />
              <Route path="/verify" element={<VerifyDocument />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950">
                <div className="text-center">
                  <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                  <p className="text-dark-600 dark:text-dark-400">Page not found</p>
                  <a href="/" className="mt-4 inline-block btn-primary">Go Home</a>
                </div>
              </div>
            } />
          </Routes>
          <ToastContainer {...TOAST_CONFIG} />
          <Toaster position="top-right" reverseOrder={false} />
        </BrowserRouter>
      </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
