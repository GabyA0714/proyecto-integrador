import prisma from '../config/prisma.js';

export const getDashboard = async (req, res) => {
  try {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    // Turnos de hoy buscando en 'startsAt'
    const turnosHoy = await prisma.appointment.count({
      where: {
        startsAt: {
          gte: inicioDia,
          lte: finDia
        }
      }
    });

    // Ingresos totales buscando 'amount' en Payment
    const ingresos = await prisma.payment.aggregate({
      _sum: {
        amount: true 
      }
    });

    // Turnos cancelados usando el Enum de tu schema
    const cancelados = await prisma.appointment.count({
      where: {
        status: "CANCELLED"
      }
    });

    res.json({
      turnosHoy,
      ingresos: ingresos._sum.amount || 0,
      cancelados
    });

  } catch (error) {
    console.log("ERROR DASHBOARD:", error);
    res.status(500).json({ error: error.message });
  }
};