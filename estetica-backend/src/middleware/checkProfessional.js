import prisma from '../config/prisma.js';

export const verificarProfesional = async (professionalId, usuario) => {
  if (usuario.rol !== 'PROFESSIONAL') return true; // ADMIN y RECEPTIONIST pasan siempre

  const profesional = await prisma.professional.findUnique({
    where: { id: professionalId }
  });

  return profesional && profesional.peopleId === usuario.peopleId;
};