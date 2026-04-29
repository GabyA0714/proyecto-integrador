import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await prisma.service.findMany({
      include: { category: true } // Traemos la categoría para que el front tenga el nombre
    });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await prisma.service.findUnique({
      where: { id: String(id) },
      include: { category: true }
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearServicio = async (req, res) => {
  try {
    // Agregamos categoryId porque tu schema lo requiere
    const { nombre, defaultDurationMinutes, categoryId } = req.body; 

    const servicio = await prisma.service.create({
      data: {
        name: nombre,
        defaultDurationMinutes: Number(defaultDurationMinutes),
        categoryId: categoryId 
      },
    });

    res.status(201).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, defaultDurationMinutes, categoryId, active } = req.body;

    const servicio = await prisma.service.update({
      where: { id: String(id) },
      data: {
        name: nombre,
        defaultDurationMinutes: defaultDurationMinutes ? Number(defaultDurationMinutes) : undefined,
        categoryId: categoryId,
        active: active
      },
    });

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id: String(id) },
    });

    res.json({ mensaje: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};