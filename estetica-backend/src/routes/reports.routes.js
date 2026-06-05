import express from 'express';
import {
    reporteIngresos,
    reporteTurnos,
    reporteServicios,
} from '../controllers/reports.controller.js';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';

const router = express.Router();
/**
 * @swagger
 * /api/reports/income:
 *   get:
 *     summary: Reporte de ingresos
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de ingresos obtenido correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/income', verificarToken, autorizarRoles(['ADMIN']), reporteIngresos);

/**
 * @swagger
 * /api/reports/appointments:
 *   get:
 *     summary: Reporte de turnos
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de turnos obtenido correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/appointments', verificarToken, autorizarRoles(['ADMIN']), reporteTurnos);

/**
 * @swagger
 * /api/reports/services:
 *   get:
 *     summary: Reporte de servicios más demandados
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de servicios obtenido correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/services', verificarToken, autorizarRoles(['ADMIN']), reporteServicios);

export default router;