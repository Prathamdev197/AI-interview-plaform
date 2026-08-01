import axios from 'axios';

// Standard Axios instance (Wanderlust style)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach Token
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (_) {}
  }
  return config;
});

// Handle 401 Logout
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('user');
    return Promise.reject(err);
  }
);

export default API;
