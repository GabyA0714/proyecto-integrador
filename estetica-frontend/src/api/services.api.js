import axios from "axios";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/services`;

// SERVICIOS

export const obtenerServicios = async (token) => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const obtenerServicioPorId = async (id, token) => {
  const res = await axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const crearServicio = async (data, token) => {
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const actualizarServicio = async (id, data, token) => {
  const res = await axios.patch(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const desactivarServicio = async (id, token) => {
  const res = await axios.patch(
    `${API}/${id}/deactivate`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

// CATEGORÍAS

export const obtenerCategorias = async (token) => {
  const res = await axios.get(`${API}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const crearCategoria = async (data, token) => {
  const res = await axios.post(`${API}/categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const actualizarCategoria = async (id, data, token) => {
  const res = await axios.patch(`${API}/categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
