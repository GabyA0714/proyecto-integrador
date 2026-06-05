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

/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Obtener horarios disponibles para un turno
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horarios disponibles obtenidos correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/available-slots', verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerHorariosDisponibles);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/',                verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerTurnos);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/:id',             verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), obtenerTurnoPorId);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 */
router.post('/',               verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST']), crearTurno);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de un turno
 *     tags:
 *       - Turnos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Transición de estado inválida
 *       404:
 *         description: Turno no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.patch('/:id/status',    verificarToken, autorizarRoles(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL']), cambiarEstadoTurno);

export default router;