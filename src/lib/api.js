// utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: ' http://localhost:3000/' || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login si no está autorizado
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api