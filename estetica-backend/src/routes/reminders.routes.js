import { Router } from 'express';
import verificarToken from '../middleware/verificarToken.js';
import { procesarRecordatorios } from '../utils/reminders.js';

const router = Router();

// POST /api/reminders/enviar → Disparar recordatorios manualmente
/**
 * @swagger
 * /api/reminders/enviar:
 *   post:
 *     summary: Disparar recordatorios manualmente
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recordatorios procesados correctamente
 *       500:
 *         description: Error al procesar recordatorios
 */
router.post('/enviar', verificarToken, async (req, res) => {
  try {
    await procesarRecordatorios();
    res.json({ mensaje: 'Recordatorios procesados correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

