import { Router } from 'express';
import verificarToken from '../middleware/verificarToken.js';
import {
  crearPago,
  obtenerPagosPorTurno,
  registrarReembolso,
  eliminarPago,
  obtenerHistorialPagos,
} from '../controllers/payments.controller.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// GET    /api/payments/historial        Historial global con filtros
/**
 * @swagger
 * /api/payments/historial:
 *   get:
 *     summary: Obtener historial global de pagos con filtros
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de pagos obtenido correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/historial', obtenerHistorialPagos);

// POST   /api/payments/:appointmentId   Registrar un pago
/**
 * @swagger
 * /api/payments/{appointmentId}:
 *   post:
 *     summary: Registrar un pago para un turno
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Pago registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.post('/:appointmentId', crearPago);

// GET    /api/payments/:appointmentId   Ver pagos + resumen de un turno
/**
 * @swagger
 * /api/payments/{appointmentId}:
 *   get:
 *     summary: Obtener pagos y resumen de un turno
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagos del turno obtenidos correctamente
 *       404:
 *         description: Turno no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/:appointmentId', obtenerPagosPorTurno);

// POST   /api/payments/:appointmentId/refund → Registrar un reembolso
/**
 * @swagger
 * /api/payments/{appointmentId}/refund:
 *   post:
 *     summary: Registrar un reembolso para un turno
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Reembolso registrado correctamente
 *       404:
 *         description: Turno no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.post('/:appointmentId/refund', registrarReembolso);

// DELETE /api/payments/:id/delete      Eliminar un pago
/**
 * @swagger
 * /api/payments/{id}/delete:
 *   delete:
 *     summary: Eliminar un pago
 *     tags:
 *       - Pagos
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
 *         description: Pago eliminado correctamente
 *       404:
 *         description: Pago no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.delete('/:id/delete', eliminarPago);

export default router;