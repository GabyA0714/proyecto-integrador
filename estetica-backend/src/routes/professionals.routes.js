import express from 'express';
import {
  obtenerProfesionales,
  obtenerProfesionalPorId,
  crearProfesional,
  actualizarProfesional,
} from '../controllers/professionals.controller.js';
import {
  obtenerHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} from '../controllers/schedule.controller.js';
import {
  generarDisponibilidad,
  revertirDisponibilidad,
  obtenerDisponibilidad,
  crearSlotManual,
  actualizarSlot,
} from '../controllers/availability.controller.js';
import {
  obtenerBloqueos,
  crearBloqueo,
  eliminarBloqueo,
} from '../controllers/exceptions.controller.js';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';

const router = express.Router();


// ── PROFESIONALES ────────────────────────────────────────────
router.get('/', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST']), obtenerProfesionales);
router.get('/:id', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerProfesionalPorId);
router.post('/', verificarToken, autorizarRoles(['ADMIN']), crearProfesional);
router.patch('/:id', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), actualizarProfesional);

// ── HORARIOS SEMANALES ───────────────────────────────────────
router.get('/:id/schedule', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerHorarios);
router.post('/:id/schedule', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), crearHorario);
router.patch('/:id/schedule/:scheduleId', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), actualizarHorario);
router.delete('/:id/schedule/:scheduleId', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), eliminarHorario);

// ── DISPONIBILIDAD ───────────────────────────────────────────
router.get('/:id/availability', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerDisponibilidad);
router.post('/:id/availability/generate', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), generarDisponibilidad);
router.post('/:id/availability', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), crearSlotManual);
router.patch('/:id/availability/:availabilityId', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), actualizarSlot);
router.delete('/:id/availability/revert', verificarToken, autorizarRoles(['ADMIN', 'PROFESSIONAL']), revertirDisponibilidad);

// ── BLOQUEOS ─────────────────────────────────────────────────
router.get('/:id/exceptions', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerBloqueos);
router.post('/:id/exceptions', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), crearBloqueo);
router.delete('/:id/exceptions/:exceptionId', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), eliminarBloqueo);


export default router;