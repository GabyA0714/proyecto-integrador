import client from "./client";

// SERVICIOS

export const obtenerServicios = async (active) => {
  const res = await client.get("/services", {
    params: active !== undefined ? { active } : undefined,
  });
  return res.data;
};

export const obtenerServicioPorId = async (id) => {
  const res = await client.get(`/services/${id}`);
  return res.data;
};

export const crearServicio = async (data) => {
  const res = await client.post("/services", data);
  return res.data;
};

export const actualizarServicio = async (id, data) => {
  const res = await client.patch(`/services/${id}`, data);
  return res.data;
};

export const desactivarServicio = async (id) => {
  const res = await client.patch(`/services/${id}/deactivate`, {});
  return res.data;
};

// CATEGORÍAS

export const obtenerCategorias = async () => {
  const res = await client.get("/services/categories");
  return res.data;
};

export const crearCategoria = async (data) => {
  const res = await client.post("/services/categories", data);
  return res.data;
};

export const actualizarCategoria = async (id, data) => {
  const res = await client.patch(`/services/categories/${id}`, data);
  return res.data;
};

// PROFESSIONAL SERVICES

export const obtenerServiciosDeProfesional = async (professionalId) => {
  const res = await client.get(
    `/services/professional-services/by-professional/${professionalId}`,
  );
  return res.data;
};

export const crearProfessionalService = async (data) => {
  const res = await client.post("/services/professional-services", data);
  return res.data;
};

export const actualizarProfessionalService = async (id, data) => {
  const res = await client.patch(`/services/professional-services/${id}`, data);
  return res.data;
};
