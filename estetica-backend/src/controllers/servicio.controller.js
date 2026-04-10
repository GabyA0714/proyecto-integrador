const prisma = require("../config/prisma");

const obtenerServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearServicio = async (req, res) => {
  try {
    const { nombre, duracionMinutos, precio } = req.body;

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        duracionMinutos: Number(duracionMinutos),
        precio: Number(precio),
      },
    });

    res.status(201).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, duracionMinutos, precio } = req.body;

    const servicio = await prisma.servicio.update({
      where: { id: Number(id) },
      data: {
        nombre,
        duracionMinutos: Number(duracionMinutos),
        precio: Number(precio),
      },
    });

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.servicio.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
