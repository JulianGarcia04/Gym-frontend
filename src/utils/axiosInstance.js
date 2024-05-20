// src/utils/axiosInstance.js
import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api'  // Ajusta la URL base según tu configuración
});

// Agregar un interceptor para adjuntar el token a las cabeceras
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-user'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
