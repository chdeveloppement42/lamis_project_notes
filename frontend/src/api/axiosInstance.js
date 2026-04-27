import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor: Attach JWT if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage so the next check (or reload) shows as logged out
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // We do NOT force redirect here to avoid breaking public pages 
      // that happen to have an invalid token in storage.
      // ProtectedRoutes will handle the redirect if the user is on a guarded page.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
