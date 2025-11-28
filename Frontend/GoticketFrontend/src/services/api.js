import axios from 'axios';
// Change this line to go up one directory level:
import config from '../config';  // Go up from services/ to src/

const api = axios.create({
  baseURL: config.BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;