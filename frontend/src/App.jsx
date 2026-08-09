import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@context/ThemeContext";
import { AuthProvider } from "@context/AuthContext";
import { TOAST_CONFIG } from "@config/constants";

import ProtectedRoute from "@components/common/ProtectedRoute";
import PublicRoute from "@components/common/PublicRoute";

import Home from "@pages/Home";
import Login from "@pages/auth/Login";
import Register from "@pages/auth/Register";
import Dashboard from "@pages/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
