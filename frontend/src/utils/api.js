import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true // Enable sending cookies with requests
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Only redirect to login if not already on login page and it's an auth error
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
