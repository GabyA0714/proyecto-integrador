import { PrismaClient } from '@prisma/client';
import { verificarProfesional } from '../middleware/checkProfessional.js';

const prisma = new PrismaClient();

export const generarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({ mensaje: 'year y month son obligatorios' });
    }

    const profesional = await prisma.professional.findUnique({ where: { id } });
    if (!profesional) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }

    const horarios = await prisma.recurringSchedule.findMany({
      where: { professionalId: id, active: true },
    });

    if (horarios.length === 0) {
      return res.status(400).json({ mensaje: 'El profesional no tiene horarios recurrentes activos' });
    }

    const inicioMes = new Date(year, month - 1, 1);
    const finMes    = new Date(year, month, 0);

    const excepciones = await prisma.availabilityException.findMany({
      where: { professionalId: id, exceptionDate: { gte: inicioMes, lte: finMes } },
    });

    const diasBloqueados = new Set(
      excepciones.map((e) => e.exceptionDate.toISOString().slice(0, 10))
    );

    const slotsACrear = [];
    const cursor = new Date(inicioMes);

    while (cursor <= finMes) {
      const diaSemana = cursor.getDay();
      const fechaStr  = cursor.toISOString().slice(0, 10);

      if (!diasBloqueados.has(fechaStr)) {
        const horariosDelDia = horarios.filter((h) => h.dayOfWeek === diaSemana);

        for (const h of horariosDelDia) {
          const existe = await prisma.availability.findFirst({
            where: { professionalId: id, date: new Date(fechaStr) },
          });

          if (!existe) {
            slotsACrear.push({
              professionalId: id,
              date:      new Date(fechaStr),
              startTime: h.startTime,
              endTime:   h.endTime,
            });
          }
        }
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    await prisma.availability.createMany({ data: slotsACrear });

    res.status(201).json({
      mensaje: 'Disponibilidad generada correctamente',
      slotsCreados: slotsACrear.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const revertirDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({ mensaje: 'year y month son obligatorios' });
    }

    const inicioMes = new Date(year, month - 1, 1);
    const finMes    = new Date(year, month, 0);

    const resultado = await prisma.availability.deleteMany({
      where: {
        professionalId: id,
        date: { gte: inicioMes, lte: finMes },
        appointments: { none: {} },
      },
    });

    res.json({ mensaje: 'Disponibilidad revertida correctamente', slotsEliminados: resultado.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    const profesional = await prisma.professional.findUnique({ where: { id } });
    if (!profesional) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }

    // Si vienen year y month filtra por mes, sino devuelve todo
    let where = { professionalId: id };
    if (year && month) {
      const inicioMes = new Date(year, month - 1, 1);
      const finMes    = new Date(year, month, 0);
      where.date = { gte: inicioMes, lte: finMes };
    }

    const slots = await prisma.availability.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: { appointments: { select: { id: true, status: true } } },
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearSlotManual = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ mensaje: 'date, startTime y endTime son obligatorios' });
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end   = new Date(`1970-01-01T${endTime}`);

    if (end <= start) {
      return res.status(400).json({ mensaje: 'endTime debe ser posterior a startTime' });
    }

    const profesional = await prisma.professional.findUnique({ where: { id } });
    if (!profesional) {
      return res.status(404).json({ mensaje: 'Profesional no encontrado' });
    }

    if (!await verificarProfesional(id, req.usuario)) {
      return res.status(403).json({ mensaje: 'Solo podés gestionar tu propia agenda' });
    }

    // Verificamos que no exista ya un slot para esa fecha
    const existe = await prisma.availability.findFirst({
      where: { professionalId: id, date: new Date(date) },
    });

    if (existe) {
      return res.status(409).json({ 
        mensaje: 'Ya existe un slot para esa fecha. Usá PATCH para modificarlo.',
        id: existe.id,
      });
    }

    const slot = await prisma.availability.create({
      data: {
        professionalId: id,
        date:      new Date(date),
        startTime: start,
        endTime:   end,
      },
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarSlot = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { startTime, endTime, active } = req.body;

    const slot = await prisma.availability.findUnique({ where: { id: availabilityId } });
    if (!slot) {
      return res.status(404).json({ mensaje: 'Slot de disponibilidad no encontrado' });
    }

    if (!await verificarProfesional(slot.professionalId, req.usuario)) {
      return res.status(403).json({ mensaje: 'Solo podés gestionar tu propia agenda' });
    }

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end   = new Date(`1970-01-01T${endTime}`);
      if (end <= start) {
        return res.status(400).json({ mensaje: 'endTime debe ser posterior a startTime' });
      }
    }

    const slotActualizado = await prisma.availability.update({
      where: { id: availabilityId },
      data: {
        ...(startTime !== undefined && { startTime: new Date(`1970-01-01T${startTime}`) }),
        ...(endTime   !== undefined && { endTime:   new Date(`1970-01-01T${endTime}`) }),
        ...(active    !== undefined && { active }),
      },
    });

    res.json(slotActualizado);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Slot no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};