import axios from 'axios';

const DEPLOYED='https://e-commerce-server-production-0873.up.railway.app'
const LOCALHOST='http://localhost:5454'

export const API_BASE_URL = LOCALHOST

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
