import { Router } from 'express';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';
import { procesarRecordatorios } from '../utils/reminders.js';

const router = Router();

// POST /api/reminders/enviar → Disparar recordatorios manualmente
/**
 * @swagger
 * /api/reminders/enviar:
 *   post:
 *     summary: Disparar recordatorios manualmente (solo ADMIN)
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recordatorios procesados correctamente
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado (rol sin permiso)
 *       500:
 *         description: Error al procesar recordatorios
 */
// CORRECCIÓN: este endpoint dispara un envío masivo de mails. Antes solo tenía
// verificarToken, así que cualquier usuario autenticado podía dispararlo.
// Ahora queda restringido a ADMIN.
router.post(
  '/enviar',
  verificarToken,
  autorizarRoles(['ADMIN']),
  async (req, res) => {
    try {
      await procesarRecordatorios();
      res.json({ mensaje: 'Recordatorios procesados correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
