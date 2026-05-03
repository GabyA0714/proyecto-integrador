import prisma from '../config/prisma.js';

export const reporteIngresos = async (req, res) => {
  try {
    const { desde, hasta, professionalId } = req.query;

    const where = {
      ...(desde || hasta ? {
        paidAt: {
          ...(desde && { gte: new Date(desde) }),
          ...(hasta && { lte: new Date(hasta) }),
        },
      } : {}),
      ...(professionalId ? {
        appointment: {
          professionalService: { professionalId },
        },
      } : {}),
    };

    const pagos = await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            professionalService: {
              include: {
                professional: { include: { person: true } },
                service: true,
              },
            },
          },
        },
      },
    });

    const total            = pagos.filter(p => !p.isRefund).reduce((acc, p) => acc + Number(p.amount), 0);
    const totalDevoluciones = pagos.filter(p =>  p.isRefund).reduce((acc, p) => acc + Number(p.amount), 0);

    res.json({
      totalIngresos:     total - totalDevoluciones,
      totalBruto:        total,
      totalDevoluciones,
      cantidadPagos:     pagos.filter(p => !p.isRefund).length,
      pagos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reporteTurnos = async (req, res) => {
  try {
    const { desde, hasta, professionalId } = req.query;

    const where = {
      ...(desde || hasta ? {
        startsAt: {
          ...(desde && { gte: new Date(desde) }),
          ...(hasta && { lte: new Date(hasta) }),
        },
      } : {}),
      ...(professionalId ? {
        professionalService: { professionalId },
      } : {}),
    };

    const turnos = await prisma.appointment.findMany({ where });

    const porEstado = turnos.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      total: turnos.length,
      porEstado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reporteServicios = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const where = {
      status: { in: ['CONFIRMED', 'COMPLETED', 'IN_PROGRESS'] },
      ...(desde || hasta ? {
        startsAt: {
          ...(desde && { gte: new Date(desde) }),
          ...(hasta && { lte: new Date(hasta) }),
        },
      } : {}),
    };

    const turnos = await prisma.appointment.findMany({
      where,
      include: {
        professionalService: { include: { service: true } },
      },
    });

    const porServicio = turnos.reduce((acc, t) => {
      const nombre = t.professionalService.service.name;
      acc[nombre] = (acc[nombre] || 0) + 1;
      return acc;
    }, {});

    const ranking = Object.entries(porServicio)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    res.json({ ranking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};