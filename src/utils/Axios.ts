import axios from "axios";

// Environment-based base URL configuration
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Production API URL from environment variables
    return import.meta.env.VITE_BASE_URL || "https://your-production-api.com";
  }
  // Development fallback
  return import.meta.env.VITE_BASE_URL || "http://127.0.0.1:5000";
};

const BASE_URL = getBaseUrl();

const axiosJSON = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

const axiosForm = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 60000, // 60 seconds for file uploads
});

axiosJSON.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosJSON.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

axiosForm.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosForm.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosForm, axiosJSON };
