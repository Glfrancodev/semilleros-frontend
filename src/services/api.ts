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

// Interceptor de respuesta para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, la devolvemos tal cual
    return response;
  },
  (error) => {
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const { status, data } = error.response;

      // Si es 401 (No autorizado), podríamos limpiar el token
      if (status === 401) {
        localStorage.removeItem("token");
        // Opcional: redirigir al login
        // window.location.href = '/login';
      }

      // Lanzar el error con el mensaje del backend si existe
      if (data?.message) {
        throw new Error(data.message);
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      throw new Error("No se pudo conectar con el servidor");
    } else {
      // Algo más ocurrió
      throw new Error("Error al procesar la petición");
    }

    return Promise.reject(error);
  }
);

export default api;

