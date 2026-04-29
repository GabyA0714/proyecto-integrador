import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
// Importamos los middlewares oficiales
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';

const router = express.Router();

// Usamos la cadena de middlewares correcta
router.get("/", verificarToken, autorizarRoles("ADMIN"), getDashboard);

export default router;