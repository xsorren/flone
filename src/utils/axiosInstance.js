// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto según tu configuración
});

// Interceptor para agregar el token en los headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Si no hay token, asegúrate de que no se envíe el header Authorization
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
