import prisma from '../config/prisma.js';
import { verificarProfesional } from '../middleware/checkProfessional.js';

export const obtenerBloqueos = async (req, res) => {
  try {
    const { id } = req.params;

    const profesional = await prisma.professional.findUnique({ where: { id } });
    if (!profesional) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }

    const bloqueos = await prisma.availabilityException.findMany({
      where: { professionalId: id },
      orderBy: { exceptionDate: 'asc' },
    });

    res.json(bloqueos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearBloqueo = async (req, res) => {
  try {
    const { id } = req.params;
    const { exceptionDate, startTime, endTime, exceptionType, reason } = req.body;

    if (!exceptionDate || !exceptionType) {
      return res.status(400).json({ mensaje: 'exceptionDate y exceptionType son obligatorios' });
    }

    const tiposValidos = ['HOLIDAY', 'SICK_LEAVE', 'PERSONAL', 'OTHER'];
    if (!tiposValidos.includes(exceptionType)) {
      return res.status(400).json({ mensaje: `exceptionType debe ser uno de: ${tiposValidos.join(', ')}` });
    }

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00Z`);
      const end   = new Date(`1970-01-01T${endTime}:00Z`);
      if (end <= start) {
        return res.status(400).json({ mensaje: 'endTime debe ser posterior a startTime' });
      }
    }

    const profesional = await prisma.professional.findUnique({ where: { id } });
    if (!profesional) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }

    if (!await verificarProfesional(id, req.usuario)) {
      return res.status(403).json({ mensaje: 'Solo podés gestionar tu propia agenda' });
    }

    const start = startTime ? new Date(`1970-01-01T${startTime}:00Z`) : new Date('1970-01-01T00:00:00Z');
    const end   = endTime   ? new Date(`1970-01-01T${endTime}:00Z`)   : new Date('1970-01-01T23:59:59Z');

    const bloqueo = await prisma.availabilityException.create({
      data: {
        professionalId: id,
        exceptionDate:  new Date(exceptionDate),
        startTime:      start,
        endTime:        end,
        exceptionType,
        reason:         reason ?? null,
      },
    });

    res.status(201).json(bloqueo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarBloqueo = async (req, res) => {
  try {
    const { exceptionId } = req.params;

    await prisma.availabilityException.delete({ where: { id: exceptionId } });

    res.json({ mensaje: 'Bloqueo eliminado correctamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Bloqueo no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};