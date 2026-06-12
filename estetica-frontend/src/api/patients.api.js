import client from "./client";

export const obtenerPacientes = async (search = "") => {
  const res = await client.get("/patients", {
    params: search ? { search } : undefined,
  });
  return res.data;
};

export const obtenerPacientePorId = async (id) => {
  const res = await client.get(`/patients/${id}`);
  return res.data;
};

export const crearPaciente = async (data) => {
  const res = await client.post("/patients", data);
  return res.data;
};

export const actualizarPaciente = async (id, data) => {
  const res = await client.patch(`/patients/${id}`, data);
  return res.data;
};

// HISTORIAL

export const obtenerHistorialTurnos = async (id) => {
  const res = await client.get(`/patients/${id}/appointments`);
  return res.data;
};

export const obtenerHistorialPagos = async (id) => {
  const res = await client.get(`/patients/${id}/payments`);
  return res.data;
};
