import express from 'express';
import { register, login, perfil } from '../controllers/auth.controller.js';
import verificarToken from '../middleware/verificarToken.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// ¡Ruta reactivada!
router.get('/me', verificarToken, perfil);

export default router;