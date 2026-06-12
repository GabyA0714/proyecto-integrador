import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
// Importamos los middlewares oficiales
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';

const router = express.Router();

// Usamos la cadena de middlewares correcta

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener datos del dashboard de KPIs
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard obtenidos correctamente
 *       401:
 *         description: Token inválido o ausente
 */
// CORRECCIÓN: autorizarRoles espera un ARRAY, no un string.
// Antes: autorizarRoles("ADMIN") -> funcionaba de casualidad ("ADMIN".includes("ADMIN")),
// pero un string hace match por substring y es frágil.
router.get("/", verificarToken, autorizarRoles(["ADMIN"]), getDashboard);

export default router;
