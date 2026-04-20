const prisma = require("../config/prisma");

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: {
        usuario: true,
      },
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
      },
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearPaciente = async (req, res) => {
  try {
    const { usuarioId, telefono, notas } = req.body;

    const paciente = await prisma.paciente.create({
      data: {
        usuarioId,
        telefono,
        notas,
      },
    });

    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { telefono, notas } = req.body;

    const paciente = await prisma.paciente.update({
      where: { id: Number(id) },
      data: {
        telefono,
        notas,
      },
    });

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.paciente.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Paciente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente  ,
};
