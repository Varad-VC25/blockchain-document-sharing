import axios from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@config/constants";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        toast.error("Session expired. Please login again");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      }
    }
    if (error.response?.status === 403) toast.error(message);
    if (error.response?.status === 429) toast.error("Too many requests. Please wait");
    if (error.response?.status >= 500) toast.error("Server error. Please try again");
    return Promise.reject(error);
  }
);

export default api;
