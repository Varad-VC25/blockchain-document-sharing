import { createContext, useContext, useState, useEffect } from "react";
import authService from "@services/authService";
import { STORAGE_KEYS } from "@config/constants";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        try {
          const response = await authService.getMe();
          setUser(response.data.user);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        } catch (error) {
          logout();
        }
      }
    } catch (error) {
      console.error("Auth init error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { user, token } = response.data;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    return response;
  };

  const register = async (fullName, email, password) => {
    const response = await authService.register({ fullName, email, password });
    const { user, token } = response.data;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try { await authService.logout(); } catch (e) {}
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
  };

  const value = { user, isAuthenticated, loading, login, register, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
