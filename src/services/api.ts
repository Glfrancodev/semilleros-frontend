import axios from "axios";

// Se crea una instancia de Axios con la URL base del .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // usa la variable del .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
