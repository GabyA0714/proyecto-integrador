import axios from "axios";

// Instancia única de axios para todo el front.
// - baseURL centralizada (antes cada archivo api la reconstruía).
// - el interceptor inyecta el token automáticamente, así las funciones
//   de la capa api/ ya no necesitan recibir `token` por parámetro.
// - punto único para, a futuro, manejar 401 -> logout, reintentos, etc.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
