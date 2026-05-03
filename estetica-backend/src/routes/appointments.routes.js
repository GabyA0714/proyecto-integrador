import express from 'express';
import {
  obtenerHorariosDisponibles,
  obtenerTurnos,
  obtenerTurnoPorId,
  crearTurno,
  cambiarEstadoTurno,
} from '../controllers/appointments.controller.js';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';

const router = express.Router();

// IMPORTANTE: /available-slots debe ir ANTES de /:id
router.get('/available-slots', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerHorariosDisponibles);
router.get('/',                verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerTurnos);
router.get('/:id',             verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerTurnoPorId);
router.post('/',               verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST']), crearTurno);
router.patch('/:id/status',    verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), cambiarEstadoTurno);

export default router;