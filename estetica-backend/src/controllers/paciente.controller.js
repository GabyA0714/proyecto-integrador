import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.patient.findMany({
      include: {
        person: {
          include: { user: true } // Traemos los datos de la persona y de su usuario si tiene
        }
      },
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await prisma.patient.findUnique({
      where: { id: String(id) },
      include: {
        person: true
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

export const crearPaciente = async (req, res) => {
  try {
    // Para crear un paciente suelto, necesitamos vincularlo a una Persona existente
    const { peopleId, cuilCuit } = req.body;

    const paciente = await prisma.patient.create({
      data: {
        peopleId,
        cuilCuit: cuilCuit || ""
      },
      include: { person: true }
    });

    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { cuilCuit } = req.body;

    const paciente = await prisma.patient.update({
      where: { id: String(id) },
      data: {
        cuilCuit
      },
    });

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.patient.delete({
      where: { id: String(id) },
    });

    res.json({ mensaje: "Paciente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};